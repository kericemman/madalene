import { z } from "zod";
import {
  CodeOfResonanceEntry,
  codeOfResonanceStatuses,
  codeOfResonanceTypes
} from "../models/CodeOfResonanceEntry.js";
import { Lead } from "../models/Lead.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/apiResponse.js";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "A valid record id is required.");

const emptyToUndefined = (value) => {
  if (value === "") return undefined;
  return value;
};

const optionalUrl = z.preprocess(
  emptyToUndefined,
  z.string().url("Enter a valid URL.").max(500).optional()
);

const optionalObjectId = z.preprocess(emptyToUndefined, objectId.optional());

const stringList = z
  .array(z.string().trim().min(1).max(80))
  .optional();

const entrySchema = z.object({
  title: z.string().min(2).max(180),
  slug: z.string().trim().min(2).max(180).toLowerCase().optional(),
  contentType: z.enum(codeOfResonanceTypes).default("essay"),
  status: z.enum(codeOfResonanceStatuses).optional(),
  strategicGoal: z
    .object({
      journeyStage: z
        .enum(["awareness", "belief_shift", "trust_building", "proof", "conversion", "retention"])
        .optional(),
      audience: z.string().max(220).optional(),
      objective: z.string().max(500).optional(),
      readerShift: z.string().max(700).optional(),
      primaryCta: z.string().max(220).optional(),
      successMetric: z.string().max(220).optional()
    })
    .optional(),
  editorialPlan: z
    .object({
      pillar: z.string().max(160).optional(),
      angle: z.string().max(500).optional(),
      coreQuestion: z.string().max(500).optional(),
      thesis: z.string().max(900).optional(),
      proofPoints: z.array(z.string().trim().min(1).max(180)).optional()
    })
    .optional(),
  qualityChecks: z
    .object({
      clearPromise: z.boolean().optional(),
      readerRelevance: z.boolean().optional(),
      trustSignal: z.boolean().optional(),
      emotionalResonance: z.boolean().optional(),
      specificProof: z.boolean().optional(),
      clearNextStep: z.boolean().optional()
    })
    .optional(),
  excerpt: z.string().max(700).optional(),
  body: z.string().max(30000).optional(),
  ctaText: z.string().max(120).optional(),
  ctaUrl: optionalUrl,
  category: z.string().max(120).optional(),
  tags: stringList,
  coverImage: optionalObjectId,
  authorName: z.string().max(120).optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().optional(),
  readingTimeMinutes: z.number().min(0).max(120).optional(),
  publishedAt: z.coerce.date().optional().nullable(),
  source: z
    .object({
      title: z.string().max(180).optional(),
      author: z.string().max(160).optional(),
      url: optionalUrl
    })
    .optional(),
  caseStudy: z
    .object({
      clientName: z.string().max(160).optional(),
      challenge: z.string().max(1200).optional(),
      result: z.string().max(1200).optional()
    })
    .optional(),
  testimonial: z
    .object({
      before: z.string().max(1200).optional(),
      after: z.string().max(1200).optional(),
      name: z.string().max(160).optional(),
      role: z.string().max(160).optional()
    })
    .optional(),
  seo: z
    .object({
      title: z.string().max(180).optional(),
      description: z.string().max(320).optional(),
      canonicalUrl: optionalUrl,
      image: optionalObjectId
    })
    .optional()
});

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseBoolean = (value) => {
  if (value === undefined) return undefined;
  if (value === "true" || value === true) return true;
  if (value === "false" || value === false) return false;
  return undefined;
};

const pagination = (req) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

const buildQuery = (req) => {
  const query = {};
  if (req.query.contentType) query.contentType = req.query.contentType;
  if (req.query.status) query.status = req.query.status;
  if (req.query.tag) query.tags = req.query.tag;
  const featured = parseBoolean(req.query.featured);
  if (featured !== undefined) query.featured = featured;

  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "i");
    query.$or = [
      { title: regex },
      { excerpt: regex },
      { body: regex },
      { category: regex },
      { tags: regex },
      { "strategicGoal.audience": regex },
      { "strategicGoal.objective": regex },
      { "strategicGoal.readerShift": regex },
      { "editorialPlan.pillar": regex },
      { "editorialPlan.angle": regex },
      { "editorialPlan.coreQuestion": regex },
      { "editorialPlan.thesis": regex },
      { "editorialPlan.proofPoints": regex }
    ];
  }

  return query;
};

const findEntryOr404 = async (id) => {
  const entry = await CodeOfResonanceEntry.findById(objectId.parse(id));
  if (!entry) {
    const error = new Error("Code of Resonance entry not found.");
    error.statusCode = 404;
    throw error;
  }
  return entry;
};

const summarizeContent = async () => {
  const subscriberQuery = {
    newsletterConsent: true,
    "communicationPreferences.marketing": true,
    $and: [
      { $or: [{ unsubscribedAt: { $exists: false } }, { unsubscribedAt: null }] },
      {
        $or: [
          { tags: "code-of-resonance-subscriber" },
          { leadSource: /^code_of_resonance/i }
        ]
      }
    ]
  };
  const [byStatus, byType, featuredCount, subscriberCount] = await Promise.all([
    CodeOfResonanceEntry.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    CodeOfResonanceEntry.aggregate([{ $group: { _id: "$contentType", count: { $sum: 1 } } }]),
    CodeOfResonanceEntry.countDocuments({ featured: true, status: { $ne: "archived" } }),
    Lead.countDocuments(subscriberQuery)
  ]);

  return { byStatus, byType, featuredCount, subscriberCount };
};

export const listCodeOfResonanceEntries = asyncHandler(async (req, res) => {
  const { page, limit, skip } = pagination(req);
  const query = buildQuery(req);

  const [items, total, summary] = await Promise.all([
    CodeOfResonanceEntry.find(query)
      .sort({ displayOrder: 1, publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("coverImage", "secureUrl optimizedUrl thumbnailUrl altText")
      .populate("lastEditedBy", "name email")
      .lean(),
    CodeOfResonanceEntry.countDocuments(query),
    summarizeContent()
  ]);

  ok(res, "Code of Resonance entries loaded.", {
    items,
    summary,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

export const getCodeOfResonanceEntry = asyncHandler(async (req, res) => {
  const entry = await CodeOfResonanceEntry.findById(objectId.parse(req.params.id))
    .populate("coverImage seo.image", "secureUrl optimizedUrl thumbnailUrl altText")
    .populate("lastEditedBy", "name email")
    .lean();

  if (!entry) {
    return res.status(404).json({ success: false, message: "Code of Resonance entry not found.", errors: [] });
  }

  ok(res, "Code of Resonance entry loaded.", { entry });
});

export const createCodeOfResonanceEntry = asyncHandler(async (req, res) => {
  const payload = entrySchema.parse(req.body);
  const entry = await CodeOfResonanceEntry.create({
    ...payload,
    lastEditedBy: req.user.sub
  });

  created(res, "Code of Resonance entry created.", { entry });
});

export const updateCodeOfResonanceEntry = asyncHandler(async (req, res) => {
  const payload = entrySchema.partial().parse(req.body);
  const entry = await findEntryOr404(req.params.id);

  Object.assign(entry, payload, { lastEditedBy: req.user.sub });
  await entry.save();

  ok(res, "Code of Resonance entry updated.", { entry });
});

export const deleteCodeOfResonanceEntry = asyncHandler(async (req, res) => {
  const entry = await findEntryOr404(req.params.id);
  await entry.deleteOne();

  ok(res, "Code of Resonance entry deleted.", { id: req.params.id });
});
