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
import { queueAndAttemptEmail, scheduleEmailSequence } from "../services/emailQueueService.js";
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
  resultUrl: resultToken ? `${env.appUrl}/results/${resultToken}` : undefined,
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

const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

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

const buildGapResourcesEmailHtml = (gapResources = []) =>
  gapResources
    .map(
      (resource) => `
        <div style="margin:14px 0;padding:16px;border:1px solid #DCE8DF;border-radius:8px;background:#F5F7F4;">
          <p style="margin:0;color:#0B6E4F;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">${escapeHtml(resource.categoryName)} focus</p>
          <p style="margin:7px 0 0;color:#222222;font-size:16px;font-weight:800;line-height:1.35;">${escapeHtml(resource.title)}</p>
          <p style="margin:7px 0 0;color:#222222;font-size:14px;line-height:1.55;">${escapeHtml(resource.description)}</p>
        </div>`
    )
    .join("");

const buildGapResourcesText = (gapResources = []) =>
  gapResources
    .map((resource) => `${resource.categoryName}: ${resource.title}\n${resource.description || ""}`.trim())
    .join("\n\n");

const buildResourceEmailVariables = ({ result, resource, stage }) => {
  const emailDelivery = resource?.emailDelivery || {};
  const title = emailDelivery.title || resource?.title || "Your personalised credibility resource";
  const bodyHtml =
    emailDelivery.bodyHtml ||
    `<p>${emailDelivery.intro || resource?.description || "Use this resource to make your earned credibility more visible."}</p>`;
  const cta = resolveEmailCta({
    text: emailDelivery.ctaText,
    url: emailDelivery.ctaUrl
  });

  return {
    firstName: result.participant.firstName || "there",
    stage: stage?.name || result.credibilityStage?.name || "Earned Credibility",
    resourceSubject: emailDelivery.subject || title,
    resourcePreheader: emailDelivery.preheader || resource?.description || "Your personalised credibility resource is inside this email.",
    resourceTitle: title,
    resourceFocus: resource?.relatedAssessmentScoreRange || stage?.name || "Earned Credibility",
    resourceBodyHtml: bodyHtml,
    resourceText: emailDelivery.text || stripHtml(bodyHtml),
    ctaText: cta.ctaText,
    ctaUrl: cta.ctaUrl
  };
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

  const aiReport = aiAnalysis.status === "complete" ? aiAnalysis.report : undefined;
  const scoreBasis = scoring.scoringSnapshot?.scoreSource === "evidence_rubric"
    ? "Your result is based on the written evidence you shared for each credibility pillar, with your statement ratings used as a self-reflection cross-check."
    : "Your result currently uses your statement ratings because the written-evidence review was unavailable."
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
      strongestCategory: result.strongestCategory?.name,
      weakestCategory: result.weakestCategory?.name,
      scoreBasis,
      personalizedHeadline: aiReport?.headline || "Your current credibility picture",
      personalizedSummary:
        aiReport?.summary ||
        result.credibilityStage?.report?.whatItMeans ||
        result.credibilityStage?.description ||
        "Your score shows where your earned credibility is already visible and where it needs to become easier to trust.",
      earnedCredibility:
        aiReport?.earnedCredibility ||
        "Your result is not a measure of your worth. It is a practical snapshot of what people can currently see and trust.",
      gapResourcesHtml: buildGapResourcesEmailHtml(gapResources),
      gapResourcesText: buildGapResourcesText(gapResources),
      stageResourceTitle: stageResource?.title || result.credibilityStage?.report?.recommendedResourceTitle || "Your recommended resource",
      stageResourceDescription:
        stageResource?.description || "I will send this resource directly to your inbox so you can work through it without a separate download.",
      intensiveCtaText: intensiveCta.ctaText,
      intensiveCtaUrl: intensiveCta.ctaUrl,
      recommendedAction: intensiveCta.ctaText,
      resultsUrl: `${env.appUrl}/results/${resultToken}`
    }
  });

  const resourceIds = [...new Set([...gapResources.map((resource) => String(resource.resource)), String(stageResource?.resource || "")].filter(Boolean))];
  const resourcesToDeliver = resourceIds.length
    ? await Resource.find({ _id: { $in: resourceIds }, active: true }).lean()
    : [];
  const resourceDeliveries = await Promise.all(
    resourcesToDeliver
      .filter((resource) => resource?.emailDelivery?.bodyHtml || resource?.emailDelivery?.text)
      .map((resource) =>
        queueAndAttemptEmail({
          to: result.participant.email,
          name: `${result.participant.firstName} ${result.participant.lastName || ""}`.trim(),
          templateKey: "resource_email_delivery",
          relatedLead: lead._id,
          relatedAssessment: result._id,
          relatedOffer: recommendationSnapshot?.offer,
          idempotencyKey: `resource-delivery:${result._id}:${resource._id}`,
          variables: buildResourceEmailVariables({
            result,
            resource,
            stage: scoreRange
          })
        })
      )
  );

  let sequenceEmails = [];
  if (recommendationRule?.emailSequenceKey) {
    sequenceEmails = await scheduleEmailSequence({
      sequenceKey: recommendationRule.emailSequenceKey,
      to: result.participant.email,
      name: `${result.participant.firstName} ${result.participant.lastName || ""}`.trim(),
      relatedLead: lead._id,
      variables: {
        firstName: result.participant.firstName,
        score: result.overallScore,
        scoreMax: result.overallMaxScore || scoring.overallMaxScore || 100,
        stage: result.credibilityStage?.name || "Earned Credibility",
        weakestCategory: result.weakestCategory?.name || "your focus area",
        strongestCategory: result.strongestCategory?.name || "your strongest area",
        ctaText: intensiveCta.ctaText,
        ctaUrl: intensiveCta.ctaUrl
      },
      metadata: {
        source: "assessment_recommendation",
        assessmentResult: result._id,
        recommendationRule: recommendationRule._id
      }
    });
  }

  created(res, "Assessment completed successfully.", {
    result: resultSummary(result.toObject(), resultToken),
    emailDelivery: resultDelivery.delivery,
    resourceDeliveries: resourceDeliveries.map((delivery) => delivery.delivery),
    scheduledSequenceEmails: sequenceEmails.length
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
