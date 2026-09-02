import { z } from "zod";
import { env } from "../config/env.js";
import { AssessmentQuestion } from "../models/AssessmentQuestion.js";
import { AssessmentResult } from "../models/AssessmentResult.js";
import { AssessmentVersion } from "../models/AssessmentVersion.js";
import { Lead } from "../models/Lead.js";
import { Resource } from "../models/Resource.js";
import { analyzeAssessmentEvidence, applyAiEvidenceScores } from "../services/assessmentAiService.js";
import { calculateAssessmentScore, publicQuestion } from "../services/assessmentScoringService.js";
import {
  buildRecommendationSnapshot,
  findScoreRange,
  selectRecommendationRule
} from "../services/recommendationService.js";
import { queueAndAttemptEmail } from "../services/emailQueueService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/apiResponse.js";
import { createSecureToken, hashToken } from "../utils/tokenUtils.js";

const answerValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.array(z.number())
]);

const submitAssessmentSchema = z.object({
  participant: z.object({
    firstName: z.string().min(1).max(80),
    lastName: z.string().max(80).optional(),
    email: z.string().email(),
    profession: z.string().max(120).optional(),
    businessStage: z.string().max(120).optional(),
    primaryChallenge: z.string().max(600).optional(),
    desiredOutcome: z.string().max(240).optional(),
    readinessToInvest: z.string().max(120).optional(),
    website: z.string().max(240).optional(),
    linkedInProfile: z.string().max(240).optional(),
    country: z.string().max(120).optional(),
    newsletterConsent: z.boolean().optional(),
    marketingConsent: z.boolean().optional(),
    consent: z.literal(true),
    consentVersion: z.string().max(40).optional()
  }),
  answers: z
    .array(
      z.object({
        questionId: z.string().optional(),
        questionKey: z.string().optional(),
        value: answerValueSchema
      })
    )
    .min(1),
  idempotencyKey: z.string().max(120).optional(),
  leadSource: z.string().max(120).optional(),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      term: z.string().optional(),
      content: z.string().optional()
    })
    .optional()
});

const oneToOneCallCtaText = "Book a 1:1 Call";
const earnedCredibilityApplicationPath = "/application/earned-credibility-intensive";

const normalizePublicRecommendation = (recommendation) => {
  if (!recommendation) return recommendation;

  const ctaText = String(recommendation.ctaText || "").trim();
  const ctaDestination = String(recommendation.ctaDestination || "").trim();
  const isEarnedCredibilityCta =
    ctaDestination.includes(earnedCredibilityApplicationPath) ||
    /earned credibility intensive|1:1|one-to-one/i.test(ctaText);

  if (!isEarnedCredibilityCta) return recommendation;

  return {
    ...recommendation,
    ctaText: oneToOneCallCtaText,
    ctaDestination: env.oneToOneBookingUrl
  };
};

const resultSummary = (result, resultToken) => ({
  id: result._id,
  resultToken,
  resultUrl: resultToken ? toAbsoluteUrl(`/results/${resultToken}`) : undefined,
  participant: result.participant,
  overallScore: result.overallScore,
  overallMaxScore: result.overallMaxScore || result.scoringSnapshot?.overallMaxScore || 100,
  categoryScores: result.categoryScores,
  strongestCategory: result.strongestCategory,
  weakestCategory: result.weakestCategory,
  secondWeakestCategory: result.secondWeakestCategory,
  credibilityStage: result.credibilityStage,
  recommendation: normalizePublicRecommendation(result.recommendationSnapshot),
  stageResource: result.stageResource,
  aiAnalysis: result.aiAnalysis,
  gapResources: result.gapResources || [],
  scoreSource: result.scoringSnapshot?.scoreSource || "self_assessment",
  evidenceReview: result.scoringSnapshot?.evidenceReview,
  submittedAt: result.submittedAt
});

const activeAssessmentQuery = () => ({
  status: "active",
  $or: [{ activeUntil: { $exists: false } }, { activeUntil: null }, { activeUntil: { $gte: new Date() } }]
});

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const toAbsoluteUrl = (value = "/contact") => {
  const rawValue = String(value || "/contact").trim();
  if (/^(https?:|mailto:|tel:)/i.test(rawValue)) return rawValue;

  const appUrl = String(env.frontendUrl || env.appUrl || "http://localhost:5173").replace(/\/+$/, "");
  return rawValue.startsWith("/") ? `${appUrl}${rawValue}` : `${appUrl}/${rawValue}`;
};

const oneToOneBookingUrl = () => toAbsoluteUrl(env.oneToOneBookingUrl || earnedCredibilityApplicationPath);

const resolveEmailCta = ({ text, url } = {}) => {
  const rawText = String(text || "").trim();
  const rawUrl = String(url || "").trim();
  const isEarnedCredibilityCta =
    !rawUrl ||
    rawUrl.includes(earnedCredibilityApplicationPath) ||
    /earned credibility intensive|1:1|one-to-one/i.test(rawText);

  if (isEarnedCredibilityCta) {
    return {
      ctaText: oneToOneCallCtaText,
      ctaUrl: oneToOneBookingUrl()
    };
  }

  return {
    ctaText: rawText || "View recommended next step",
    ctaUrl: toAbsoluteUrl(rawUrl)
  };
};

const resourceGapThreshold = 70;

const findGapResources = async (categoryScores = []) => {
  const gapCategories = [...categoryScores]
    .filter((category) => Number(category.score || 0) < resourceGapThreshold)
    .sort((left, right) => Number(left.score || 0) - Number(right.score || 0));

  if (!gapCategories.length) return [];

  const resources = await Resource.find({
    active: true,
    relatedWeakestCategory: { $in: gapCategories.map((category) => category.key) }
  }).lean();
  const resourceByCategory = new Map();

  for (const resource of resources) {
    if (!resourceByCategory.has(resource.relatedWeakestCategory)) {
      resourceByCategory.set(resource.relatedWeakestCategory, resource);
    }
  }

  return gapCategories.flatMap((category) => {
    const resource = resourceByCategory.get(category.key);
    if (!resource) return [];

    return [
      {
        categoryKey: category.key,
        categoryName: category.name,
        categoryScore: Math.round(Number(category.score || 0)),
        resource: resource._id,
        title: resource.title,
        description: resource.description,
        slug: resource.slug
      }
    ];
  });
};

const buildStageResource = (recommendationRule) => {
  const resource = recommendationRule?.resource;
  if (!resource) return undefined;

  return {
    resource: resource._id,
    title: resource.title,
    description: resource.description,
    slug: resource.slug
  };
};

const buildNextStepsHtml = (steps = []) => {
  const safeSteps = steps.filter(Boolean);
  if (!safeSteps.length) return "<p style=\"margin:0;\">Start by making your strongest credibility signals easier to see and trust.</p>";

  return `<ul style="margin:0 0 18px;padding-left:22px;">${safeSteps
    .map((step) => `<li style="margin:0 0 8px;">${escapeHtml(step)}</li>`)
    .join("")}</ul>`;
};

const buildNextStepsText = (steps = []) => {
  const safeSteps = steps.filter(Boolean);
  if (!safeSteps.length) return "Start by making your strongest credibility signals easier to see and trust.";
  return safeSteps.map((step) => `- ${step}`).join("\n");
};

export const getActiveAssessment = asyncHandler(async (req, res) => {
  const assessment = await AssessmentVersion.findOne(activeAssessmentQuery())
    .sort({ version: -1, activeFrom: -1 })
    .lean();

  if (!assessment) {
    return res.status(404).json({
      success: false,
      message: "No active assessment is currently available.",
      errors: []
    });
  }

  const questions = await AssessmentQuestion.find({
    assessmentVersion: assessment._id,
    active: true
  })
    .sort({ displayOrder: 1 })
    .lean();

  ok(res, "Active assessment loaded.", {
    assessment: {
      id: assessment._id,
      title: assessment.title,
      slug: assessment.slug,
      version: assessment.version,
      description: assessment.description,
      estimatedMinutes: assessment.estimatedMinutes,
      categories: assessment.categories
    },
    questions: questions.map(publicQuestion)
  });
});

export const submitAssessment = asyncHandler(async (req, res) => {
  const payload = submitAssessmentSchema.parse(req.body);

  if (payload.idempotencyKey) {
    const existing = await AssessmentResult.findOne({ idempotencyKey: payload.idempotencyKey }).lean();
    if (existing) {
      return ok(res, "Assessment was already submitted.", {
        result: resultSummary(existing),
        alreadySubmitted: true
      });
    }
  }

  const assessment = await AssessmentVersion.findOne(activeAssessmentQuery()).sort({ version: -1, activeFrom: -1 });
  if (!assessment) {
    return res.status(404).json({
      success: false,
      message: "No active assessment is currently available.",
      errors: []
    });
  }

  const questions = await AssessmentQuestion.find({
    assessmentVersion: assessment._id,
    active: true
  }).sort({ displayOrder: 1 });

  const deterministicScoring = calculateAssessmentScore({
    assessmentVersion: assessment,
    questions,
    answers: payload.answers
  });

  const aiAnalysis = await analyzeAssessmentEvidence({
    assessmentVersion: assessment,
    questions,
    answers: payload.answers,
    participant: payload.participant,
    scoring: deterministicScoring
  });
  const scoring = applyAiEvidenceScores({
    scoring: deterministicScoring,
    assessmentVersion: assessment,
    aiAnalysis
  });

  const scoreRange = await findScoreRange(scoring.overallScore);
  const gapResources = await findGapResources(scoring.categoryScores);
  const recommendationRule = await selectRecommendationRule({
    overallScore: scoring.overallScore,
    weakestCategory: scoring.weakestCategory,
    secondWeakestCategory: scoring.secondWeakestCategory,
    profession: payload.participant.profession,
    businessStage: payload.participant.businessStage,
    primaryChallenge: payload.participant.primaryChallenge,
    desiredOutcome: payload.participant.desiredOutcome,
    readinessToInvest: payload.participant.readinessToInvest
  });
  const recommendationSnapshot = buildRecommendationSnapshot(recommendationRule);
  const stageResource = buildStageResource(recommendationRule);

  const marketingConsentAt =
    payload.participant.marketingConsent || payload.participant.newsletterConsent ? new Date() : undefined;

  const lead = await Lead.findOneAndUpdate(
    { email: payload.participant.email.toLowerCase() },
    {
      $setOnInsert: {
        email: payload.participant.email.toLowerCase(),
        leadSource: payload.leadSource || "assessment"
      },
      $set: {
        firstName: payload.participant.firstName,
        lastName: payload.participant.lastName,
        profession: payload.participant.profession,
        businessStage: payload.participant.businessStage,
        website: payload.participant.website,
        linkedInProfile: payload.participant.linkedInProfile,
        country: payload.participant.country,
        primaryChallenge: payload.participant.primaryChallenge,
        desiredOutcome: payload.participant.desiredOutcome,
        readinessToInvest: payload.participant.readinessToInvest,
        utm: payload.utm,
        assessmentScore: scoring.overallScore,
        credibilityStage: scoreRange?.name,
        strongestCategory: scoring.strongestCategory?.key,
        weakestCategory: scoring.weakestCategory?.key,
        recommendedOffer: recommendationSnapshot?.offer,
        recommendedResource: recommendationSnapshot?.resource,
        newsletterConsent: Boolean(payload.participant.newsletterConsent),
        marketingConsentAt,
        consentVersion: payload.participant.consentVersion,
        status: "Assessment Completed",
        lastInteractionAt: new Date()
      }
    },
    { new: true, upsert: true }
  );

  const resultToken = createSecureToken("rq");
  const result = await AssessmentResult.create({
    assessmentVersion: assessment._id,
    assessmentVersionNumber: assessment.version,
    lead: lead._id,
    participant: {
      ...payload.participant,
      email: payload.participant.email.toLowerCase(),
      marketingConsentAt
    },
    responses: scoring.responses,
    categoryScores: scoring.categoryScores,
    overallScore: scoring.overallScore,
    overallMaxScore: scoring.overallMaxScore,
    strongestCategory: scoring.strongestCategory,
    weakestCategory: scoring.weakestCategory,
    secondWeakestCategory: scoring.secondWeakestCategory,
    scoreRange: scoreRange?._id,
    credibilityStage: scoreRange
      ? {
          name: scoreRange.name,
          description: scoreRange.description,
          recommendedAction: scoreRange.recommendedAction,
          primaryCtaText: scoreRange.primaryCtaText,
          primaryCtaUrl: scoreRange.primaryCtaUrl,
          report: scoreRange.report
        }
      : undefined,
    recommendationSnapshot,
    stageResource,
    scoringSnapshot: scoring.scoringSnapshot,
    aiAnalysis,
    gapResources,
    resultTokenHash: hashToken(resultToken),
    resultTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    idempotencyKey: payload.idempotencyKey,
    metadata: {
      leadSource: payload.leadSource,
      utm: payload.utm
    }
  });

  const stageReport = result.credibilityStage?.report || {};
  const intensiveCta = resolveEmailCta({
    text: recommendationSnapshot?.ctaText,
    url: recommendationSnapshot?.ctaDestination
  });
  const resultDelivery = await queueAndAttemptEmail({
    to: result.participant.email,
    name: `${result.participant.firstName} ${result.participant.lastName || ""}`.trim(),
    templateKey: "assessment_results",
    relatedLead: lead._id,
    relatedAssessment: result._id,
    relatedOffer: recommendationSnapshot?.offer,
    idempotencyKey: `assessment-results:${result._id}`,
    variables: {
      firstName: result.participant.firstName,
      score: result.overallScore,
      scoreMax: result.overallMaxScore || scoring.overallMaxScore || 100,
      stage: result.credibilityStage?.name || "Earned Credibility",
      stageWhatItMeans:
        stageReport.whatItMeans ||
        result.credibilityStage?.description ||
        "Your score shows where your earned credibility is already visible and where it needs to become easier to trust.",
      stageBiggestOpportunity:
        stageReport.biggestOpportunity ||
        result.credibilityStage?.recommendedAction ||
        "Make the credibility you have already earned easier for people to see, understand, and trust.",
      stageNextStepsHtml: buildNextStepsHtml(stageReport.nextSteps || []),
      stageNextStepsText: buildNextStepsText(stageReport.nextSteps || []),
      stageFinalNote:
        stageReport.finalNote ||
        "Your result is a snapshot of how your earned credibility is showing up today. Every improvement can make you easier to trust, remember, and choose.",
      stageResourceTitle: stageResource?.title || stageReport.recommendedResourceTitle || "Your recommended resource",
      stageResourceDescription:
        stageResource?.description || "I will send this resource directly to your inbox so you can work through it without a separate download.",
      intensiveCtaText: intensiveCta.ctaText,
      intensiveCtaUrl: intensiveCta.ctaUrl,
      recommendedAction: intensiveCta.ctaText,
      resultsUrl: toAbsoluteUrl(`/results/${resultToken}`)
    }
  });

  created(res, "Assessment completed successfully.", {
    result: resultSummary(result.toObject(), resultToken),
    emailDelivery: resultDelivery.delivery,
    resourceDeliveries: [],
    scheduledSequenceEmails: 0
  });
});

export const getAssessmentResultByToken = asyncHandler(async (req, res) => {
  const result = await AssessmentResult.findOne({
    resultTokenHash: hashToken(req.params.token),
    resultTokenExpiresAt: { $gt: new Date() }
  }).lean();

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "This result link is invalid or has expired.",
      errors: []
    });
  }

  ok(res, "Assessment result loaded.", {
    result: resultSummary(result)
  });
});
