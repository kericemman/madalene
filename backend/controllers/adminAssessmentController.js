import { z } from "zod";
import { AssessmentQuestion } from "../models/AssessmentQuestion.js";
import { AssessmentVersion } from "../models/AssessmentVersion.js";
import { Offer } from "../models/Offer.js";
import { RecommendationRule } from "../models/RecommendationRule.js";
import { Resource } from "../models/Resource.js";
import { ScoreRange } from "../models/ScoreRange.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/apiResponse.js";
import { sanitizeRichHtml } from "../utils/sanitizeHtml.js";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "A valid record id is required.");

const emptyToUndefined = (value) => (value === "" ? undefined : value);

const isSafeHref = (value) => {
  const href = String(value || "").trim();
  if (!href) return true;
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  return /^(https:|mailto:|tel:)/i.test(href);
};

const optionalSafeHref = (max = 500) =>
  z.preprocess(
    emptyToUndefined,
    z.string().trim().max(max).refine(isSafeHref, "Enter an HTTPS URL, mailto/tel link, or internal path.").optional()
  );

const requiredSafeHref = (max = 500) =>
  z.string().trim().min(1).max(max).refine(isSafeHref, "Enter an HTTPS URL, mailto/tel link, or internal path.");

const categorySchema = z.object({
  key: z.string().min(2).max(80),
  name: z.string().min(2).max(120),
  description: z.string().max(600).optional(),
  weight: z.number().min(0).optional(),
  displayOrder: z.number().optional()
});

const assessmentVersionSchema = z.object({
  title: z.string().min(2).max(160),
  slug: z.string().max(180).optional(),
  version: z.number().int().min(1).optional(),
  description: z.string().max(1000).optional(),
  estimatedMinutes: z.number().min(1).max(60).optional(),
  scoringMode: z.enum(["percentage", "raw_total"]).optional(),
  scoreDisplayMax: z.number().min(1).max(1000).optional(),
  aiScoringWeight: z.number().min(0).max(1).optional(),
  aiAnalysisEnabled: z.boolean().optional(),
  categories: z.array(categorySchema).min(1),
  status: z.enum(["draft", "active", "archived"]).optional(),
  activeFrom: z.coerce.date().optional(),
  activeUntil: z.coerce.date().optional().nullable()
});

const questionOptionSchema = z.object({
  label: z.string().min(1).max(180),
  value: z.string().min(1).max(120),
  score: z.number().optional(),
  displayOrder: z.number().optional()
});

const questionSchema = z.object({
  assessmentVersion: objectId,
  key: z.string().min(2).max(120),
  questionText: z.string().min(4).max(1000),
  helperText: z.string().max(1000).optional(),
  categoryKey: z.string().min(2).max(80),
  displayOrder: z.number().optional(),
  answerType: z.enum(["likert", "multiple_choice", "single_choice", "yes_no", "short_text", "long_text"]),
  options: z.array(questionOptionSchema).optional(),
  weight: z.number().min(0).optional(),
  required: z.boolean().optional(),
  scored: z.boolean().optional(),
  aiScored: z.boolean().optional(),
  aiScoringRubric: z.string().max(2400).optional(),
  active: z.boolean().optional(),
  conditionalLogic: z.any().optional().nullable(),
  versionNumber: z.number().int().min(1).optional()
});

const scoreRangeSchema = z.object({
  name: z.string().min(2).max(120),
  minScore: z.number().min(0).max(100),
  maxScore: z.number().min(0).max(100),
  description: z.string().min(4).max(1200),
  recommendedAction: z.string().max(500).optional(),
  primaryCtaText: z.string().max(160).optional(),
  primaryCtaUrl: optionalSafeHref(300),
  report: z
    .object({
      whatItMeans: z.string().max(4000).optional(),
      biggestOpportunity: z.string().max(2000).optional(),
      nextSteps: z.array(z.string().max(240)).optional(),
      recommendedResourceTitle: z.string().max(180).optional(),
      finalNote: z.string().max(2000).optional()
    })
    .optional(),
  displayOrder: z.number().optional(),
  active: z.boolean().optional()
});

const offerSchema = z.object({
  name: z.string().min(2).max(160),
  slug: z.string().max(180).optional(),
  shortDescription: z.string().max(400).optional(),
  fullDescription: z.string().max(4000).optional(),
  price: z.number().min(0).optional(),
  currency: z.string().max(12).optional(),
  offerType: z.enum([
    "free",
    "digital_product",
    "audit",
    "one_time_session",
    "intensive",
    "consulting_package",
    "application_only"
  ]),
  deliveryMethod: z.string().max(120).optional(),
  features: z.array(z.string()).optional(),
  outcomes: z.array(z.string()).optional(),
  idealClient: z.string().max(1200).optional(),
  ctaText: z.string().max(160).optional(),
  ctaType: z.enum(["checkout", "booking", "application", "external_url", "download"]).optional(),
  ctaUrl: optionalSafeHref(300),
  checkoutEnabled: z.boolean().optional(),
  bookingEnabled: z.boolean().optional(),
  applicationRequired: z.boolean().optional(),
  externalBookingUrl: optionalSafeHref(300),
  active: z.boolean().optional(),
  displayOrder: z.number().optional(),
  featured: z.boolean().optional(),
  relatedEmailSequenceKey: z.string().max(120).optional()
});

const resourceSchema = z.object({
  title: z.string().min(2).max(180),
  slug: z.string().max(180).optional(),
  description: z.string().max(1200).optional(),
  resourceType: z.enum([
    "pdf_guide",
    "workbook",
    "checklist",
    "playbook",
    "blueprint",
    "reading_list",
    "video",
    "audio",
    "external_article",
    "template",
    "email_resource"
  ]),
  coverImage: objectId.optional(),
  fileUrl: optionalSafeHref(500),
  externalUrl: optionalSafeHref(500),
  price: z.number().min(0).optional(),
  free: z.boolean().optional(),
  emailGated: z.boolean().optional(),
  category: z.string().max(120).optional(),
  relatedAssessmentScoreRange: z.string().max(120).optional(),
  relatedWeakestCategory: z.string().max(120).optional(),
  relatedOffer: objectId.optional(),
  emailDelivery: z
    .object({
      subject: z.string().max(180).optional(),
      preheader: z.string().max(240).optional(),
      title: z.string().max(180).optional(),
      intro: z.string().max(1000).optional(),
      bodyHtml: z.string().max(40000).optional(),
      text: z.string().max(40000).optional(),
      ctaText: z.string().max(160).optional(),
      ctaUrl: optionalSafeHref(500)
    })
    .optional(),
  active: z.boolean().optional()
});

const recommendationRuleSchema = z.object({
  name: z.string().min(2).max(180),
  priority: z.number().optional(),
  active: z.boolean().optional(),
  criteria: z
    .object({
      minScore: z.number().min(0).max(100).optional(),
      maxScore: z.number().min(0).max(100).optional(),
      weakestCategories: z.array(z.string()).optional(),
      secondWeakestCategories: z.array(z.string()).optional(),
      professions: z.array(z.string()).optional(),
      businessStages: z.array(z.string()).optional(),
      primaryChallenges: z.array(z.string()).optional(),
      readinessToInvest: z.array(z.string()).optional(),
      desiredOutcomes: z.array(z.string()).optional()
    })
    .optional(),
  offer: objectId.optional(),
  resource: objectId.optional(),
  explanation: z.string().min(4).max(1200),
  ctaText: z.string().min(2).max(160),
  ctaDestination: requiredSafeHref(500),
  secondaryAction: z
    .object({
      label: z.string().max(160).optional(),
      url: optionalSafeHref(500)
    })
    .optional(),
  emailSequenceKey: z.string().max(120).optional()
});

const parseBody = (schema, body, partial = false) => (partial ? schema.partial().parse(body) : schema.parse(body));

const sanitizeResourcePayload = (payload) => {
  if (payload.emailDelivery?.bodyHtml === undefined) return payload;

  return {
    ...payload,
    emailDelivery: {
      ...payload.emailDelivery,
      bodyHtml: sanitizeRichHtml(payload.emailDelivery.bodyHtml)
    }
  };
};

const pagination = (req) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 25), 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

const listCollection = async ({ model, query = {}, sort = { createdAt: -1 }, req, res, message, populate }) => {
  const { page, limit, skip } = pagination(req);
  let findQuery = model.find(query).sort(sort).skip(skip).limit(limit);
  if (populate) findQuery = findQuery.populate(populate);

  const [items, total] = await Promise.all([findQuery.lean(), model.countDocuments(query)]);
  ok(res, message, {
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
};

const findOr404 = async (model, id) => {
  const item = await model.findById(id);
  if (!item) {
    const error = new Error("Record not found.");
    error.statusCode = 404;
    throw error;
  }
  return item;
};

const choiceAnswerTypes = new Set(["likert", "multiple_choice", "single_choice", "yes_no"]);

const assertQuestionConfiguration = async (question) => {
  const assessment = await findOr404(AssessmentVersion, question.assessmentVersion);
  const categoryExists = (assessment.categories || []).some((category) => category.key === question.categoryKey);
  if (!categoryExists) {
    const error = new Error("Question category must belong to its assessment version.");
    error.statusCode = 422;
    throw error;
  }

  if (choiceAnswerTypes.has(question.answerType) && (!question.options || question.options.length < 2)) {
    const error = new Error("Choice-based questions need at least two answer options.");
    error.statusCode = 422;
    throw error;
  }
};

const assertScoreRangeDoesNotOverlap = async (range, ignoreId) => {
  if (Number(range.minScore) > Number(range.maxScore)) {
    const error = new Error("Minimum score cannot be greater than maximum score.");
    error.statusCode = 422;
    throw error;
  }

  if (range.active === false) return;

  const query = {
    active: true,
    minScore: { $lte: Number(range.maxScore) },
    maxScore: { $gte: Number(range.minScore) }
  };
  if (ignoreId) query._id = { $ne: ignoreId };

  const overlap = await ScoreRange.findOne(query).select("name minScore maxScore").lean();
  if (overlap) {
    const error = new Error(
      `This range overlaps with ${overlap.name} (${overlap.minScore}-${overlap.maxScore}). Score ranges must not overlap.`
    );
    error.statusCode = 422;
    throw error;
  }
};

const activateVersion = async (version) => {
  const now = new Date();
  await AssessmentVersion.updateMany(
    { _id: { $ne: version._id }, status: "active" },
    { $set: { status: "archived", activeUntil: now } }
  );
  version.status = "active";
  version.activeFrom = now;
  version.activeUntil = undefined;
  await version.save();
  return version;
};

const updateRecord = async ({ model, schema, req, res, label }) => {
  const payload = parseBody(schema, req.body, true);
  const item = await findOr404(model, req.params.id);
  Object.assign(item, payload);
  await item.save();
  ok(res, `${label} updated.`, { item });
};

export const listAssessmentVersions = asyncHandler((req, res) =>
  listCollection({
    model: AssessmentVersion,
    req,
    res,
    message: "Assessment versions loaded.",
    sort: { version: -1, createdAt: -1 }
  })
);

export const createAssessmentVersion = asyncHandler(async (req, res) => {
  const payload = parseBody(assessmentVersionSchema, req.body);
  const item = await AssessmentVersion.create(payload);
  if (item.status === "active") {
    await activateVersion(item);
  }
  created(res, "Assessment version created.", { item });
});

export const updateAssessmentVersion = asyncHandler((req, res) =>
  (async () => {
    const payload = parseBody(assessmentVersionSchema, req.body, true);
    const item = await findOr404(AssessmentVersion, req.params.id);
    Object.assign(item, payload);
    if (payload.status === "active") {
      await activateVersion(item);
    } else {
      await item.save();
    }
    ok(res, "Assessment version updated.", { item });
  })()
);

export const duplicateAssessmentVersion = asyncHandler(async (req, res) => {
  const source = await findOr404(AssessmentVersion, req.params.id);
  const highestVersion = await AssessmentVersion.findOne().sort({ version: -1 }).select("version").lean();
  const nextVersion = Math.max(Number(source.version || 0), Number(highestVersion?.version || 0)) + 1;

  const duplicate = await AssessmentVersion.create({
    title: `${source.title} (Draft ${nextVersion})`,
    slug: source.slug,
    version: nextVersion,
    description: source.description,
    estimatedMinutes: source.estimatedMinutes,
    scoringMode: source.scoringMode,
    scoreDisplayMax: source.scoreDisplayMax,
    aiScoringWeight: source.aiScoringWeight,
    aiAnalysisEnabled: source.aiAnalysisEnabled,
    categories: source.categories,
    status: "draft"
  });

  const sourceQuestions = await AssessmentQuestion.find({ assessmentVersion: source._id }).lean();
  if (sourceQuestions.length) {
    await AssessmentQuestion.insertMany(
      sourceQuestions.map(({ _id, createdAt, updatedAt, __v, ...question }) => ({
        ...question,
        assessmentVersion: duplicate._id,
        versionNumber: nextVersion
      }))
    );
  }

  created(res, "Draft assessment version created.", { assessment: duplicate, copiedQuestions: sourceQuestions.length });
});

export const activateAssessmentVersion = asyncHandler(async (req, res) => {
  const version = await findOr404(AssessmentVersion, req.params.id);
  await activateVersion(version);
  ok(res, "Assessment version is now live.", { item: version });
});

export const listQuestions = asyncHandler((req, res) => {
  const query = {};
  if (req.query.assessmentVersion) query.assessmentVersion = req.query.assessmentVersion;
  if (req.query.active !== undefined) query.active = req.query.active === "true";
  if (req.query.categoryKey) query.categoryKey = req.query.categoryKey;

  return listCollection({
    model: AssessmentQuestion,
    query,
    req,
    res,
    message: "Assessment questions loaded.",
    sort: { displayOrder: 1, createdAt: 1 },
    populate: "assessmentVersion"
  });
});

export const createQuestion = asyncHandler(async (req, res) => {
  const payload = parseBody(questionSchema, req.body);
  await assertQuestionConfiguration(payload);
  const item = await AssessmentQuestion.create(payload);
  created(res, "Assessment question created.", { item });
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const payload = parseBody(questionSchema, req.body, true);
  const item = await findOr404(AssessmentQuestion, req.params.id);
  Object.assign(item, payload);
  await assertQuestionConfiguration(item);
  await item.save();
  ok(res, "Assessment question updated.", { item });
});

export const listScoreRanges = asyncHandler((req, res) =>
  listCollection({
    model: ScoreRange,
    req,
    res,
    message: "Score ranges loaded.",
    sort: { displayOrder: 1, minScore: 1 }
  })
);

export const createScoreRange = asyncHandler(async (req, res) => {
  const payload = parseBody(scoreRangeSchema, req.body);
  await assertScoreRangeDoesNotOverlap(payload);
  const item = await ScoreRange.create(payload);
  created(res, "Score range created.", { item });
});

export const updateScoreRange = asyncHandler(async (req, res) => {
  const payload = parseBody(scoreRangeSchema, req.body, true);
  const item = await findOr404(ScoreRange, req.params.id);
  Object.assign(item, payload);
  await assertScoreRangeDoesNotOverlap(item, item._id);
  await item.save();
  ok(res, "Score range updated.", { item });
});

export const listOffers = asyncHandler((req, res) =>
  listCollection({
    model: Offer,
    query: req.query.active ? { active: req.query.active === "true" } : {},
    req,
    res,
    message: "Offers loaded.",
    sort: { displayOrder: 1, createdAt: -1 }
  })
);

export const createOffer = asyncHandler(async (req, res) => {
  const payload = parseBody(offerSchema, req.body);
  const item = await Offer.create(payload);
  created(res, "Offer created.", { item });
});

export const updateOffer = asyncHandler((req, res) =>
  updateRecord({
    model: Offer,
    schema: offerSchema,
    req,
    res,
    label: "Offer"
  })
);

export const listResources = asyncHandler((req, res) =>
  listCollection({
    model: Resource,
    query: req.query.active ? { active: req.query.active === "true" } : {},
    req,
    res,
    message: "Resources loaded.",
    sort: { createdAt: -1 },
    populate: "coverImage relatedOffer"
  })
);

export const createResource = asyncHandler(async (req, res) => {
  const payload = sanitizeResourcePayload(parseBody(resourceSchema, req.body));
  const item = await Resource.create(payload);
  created(res, "Resource created.", { item });
});

export const updateResource = asyncHandler(async (req, res) => {
  const payload = sanitizeResourcePayload(parseBody(resourceSchema, req.body, true));
  const item = await findOr404(Resource, req.params.id);
  Object.assign(item, payload);
  await item.save();
  ok(res, "Resource updated.", { item });
});

export const listRecommendationRules = asyncHandler((req, res) =>
  listCollection({
    model: RecommendationRule,
    req,
    res,
    message: "Recommendation rules loaded.",
    sort: { priority: -1, createdAt: 1 },
    populate: "offer resource"
  })
);

export const createRecommendationRule = asyncHandler(async (req, res) => {
  const payload = parseBody(recommendationRuleSchema, req.body);
  const item = await RecommendationRule.create(payload);
  created(res, "Recommendation rule created.", { item });
});

export const updateRecommendationRule = asyncHandler((req, res) =>
  updateRecord({
    model: RecommendationRule,
    schema: recommendationRuleSchema,
    req,
    res,
    label: "Recommendation rule"
  })
);
