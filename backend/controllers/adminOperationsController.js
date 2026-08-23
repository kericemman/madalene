import { z } from "zod";
import mongoose from "mongoose";
import { adminPublicProfile } from "../services/authService.js";
import { AdminUser } from "../models/AdminUser.js";
import { Application } from "../models/Application.js";
import { AssessmentResult } from "../models/AssessmentResult.js";
import { AssessmentVersion } from "../models/AssessmentVersion.js";
import { Booking } from "../models/Booking.js";
import { CodeOfResonanceEntry } from "../models/CodeOfResonanceEntry.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { EmailSequence } from "../models/EmailSequence.js";
import { EmailTemplate } from "../models/EmailTemplate.js";
import { Lead } from "../models/Lead.js";
import { MediaAsset } from "../models/MediaAsset.js";
import { Offer } from "../models/Offer.js";
import { Resource } from "../models/Resource.js";
import { Review } from "../models/Review.js";
import { ScheduledEmail } from "../models/ScheduledEmail.js";
import { ScoreRange } from "../models/ScoreRange.js";
import { env } from "../config/env.js";
import { queueAndAttemptEmail } from "../services/emailQueueService.js";
import { buildRecommendationSnapshot, findScoreRange, selectRecommendationRule } from "../services/recommendationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/apiResponse.js";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "A valid record id is required.");

const leadStatuses = [
  "New",
  "Assessment Completed",
  "Nurturing",
  "Guide Downloaded",
  "Audit Interested",
  "Audit Purchased",
  "Session Booked",
  "Applied",
  "Qualified",
  "Client",
  "Completed",
  "Not Ready",
  "Archived"
];

const contactStatuses = ["new", "read", "replied", "archived"];
const reviewStatuses = ["pending", "published", "hidden", "flagged"];
const scheduledEmailStatuses = ["pending", "processing", "sent", "failed", "cancelled"];
const applicationStatuses = ["new", "reviewing", "qualified", "not_ready", "accepted", "declined", "archived"];
const applicationPriorities = ["normal", "high", "urgent"];
const bookingStatuses = ["requested", "scheduled", "rescheduled", "completed", "cancelled", "no_show", "archived"];
const adminRoles = ["admin", "content_editor"];
const emailTemplateTypes = [
  "assessment_started",
  "assessment_completed",
  "assessment_next_action",
  "results_delivered",
  "free_guide_delivery",
  "newsletter_welcome",
  "code_resonance_sequence",
  "contact_confirmation",
  "admin_contact_notification",
  "purchase_confirmation",
  "payment_failed",
  "booking_confirmation",
  "booking_reminder",
  "booking_rescheduled",
  "booking_cancelled",
  "application_received",
  "application_approved",
  "application_not_ready",
  "client_intake_request",
  "deliverable_ready",
  "feedback_request",
  "testimonial_request",
  "custom"
];

const launchOfferSlugs = [
  "credibility-audit",
  "earned-credibility-intensive",
  "discern"
];

const leadUpdateSchema = z.object({
  firstName: z.string().max(80).optional(),
  lastName: z.string().max(80).optional(),
  phone: z.string().max(80).optional(),
  profession: z.string().max(120).optional(),
  industry: z.string().max(120).optional(),
  businessStage: z.string().max(120).optional(),
  website: z.string().max(240).optional(),
  linkedInProfile: z.string().max(240).optional(),
  country: z.string().max(120).optional(),
  primaryChallenge: z.string().max(240).optional(),
  desiredOutcome: z.string().max(240).optional(),
  readinessToInvest: z.string().max(120).optional(),
  status: z.enum(leadStatuses).optional(),
  tags: z.array(z.string().trim().min(1).max(80)).optional(),
  newsletterConsent: z.boolean().optional(),
  communicationPreferences: z
    .object({
      transactional: z.boolean().optional(),
      marketing: z.boolean().optional()
    })
    .optional(),
  unsubscribedAt: z.coerce.date().nullable().optional()
});

const leadNoteSchema = z.object({
  note: z.string().min(2).max(3000)
});

const contactUpdateSchema = z.object({
  status: z.enum(contactStatuses).optional(),
  reason: z.string().max(120).optional()
});

const applicationUpdateSchema = z.object({
  status: z.enum(applicationStatuses).optional(),
  priority: z.enum(applicationPriorities).optional(),
  decisionNote: z.string().max(3000).optional(),
  message: z.string().max(3000).optional()
});

const bookingUpdateSchema = z.object({
  status: z.enum(bookingStatuses).optional(),
  scheduledFor: z.coerce.date().nullable().optional(),
  timezone: z.string().max(80).optional(),
  meetingUrl: z.string().max(500).optional(),
  externalBookingUrl: z.string().max(500).optional(),
  internalNote: z.string().max(3000).optional()
});

const reviewUpdateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  role: z.string().max(140).optional(),
  headline: z.string().max(140).optional(),
  before: z.string().max(700).optional(),
  after: z.string().max(700).optional(),
  review: z.string().min(20).max(1600).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  status: z.enum(reviewStatuses).optional(),
  featured: z.boolean().optional()
});

const emailTemplateSchema = z.object({
  key: z.string().min(2).max(120).toLowerCase(),
  name: z.string().min(2).max(160),
  type: z.enum(emailTemplateTypes).optional(),
  subject: z.string().min(2).max(300),
  preheader: z.string().max(300).optional(),
  html: z.string().min(2),
  text: z.string().optional(),
  variables: z.array(z.string().trim().min(1).max(80)).optional(),
  active: z.boolean().optional(),
  editable: z.boolean().optional()
});

const codeAutomationTemplateSchema = z.object({
  subject: z.string().min(2).max(180),
  preheader: z.string().max(240).optional(),
  html: z.string().min(2).max(40000),
  text: z.string().max(40000).optional(),
  active: z.boolean().optional()
});

const scheduledEmailUpdateSchema = z.object({
  status: z.enum(scheduledEmailStatuses).optional(),
  scheduledFor: z.coerce.date().optional(),
  maxAttempts: z.number().int().min(1).max(10).optional(),
  variables: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional()
});

const mediaAssetUpdateSchema = z.object({
  displayName: z.string().max(160).optional(),
  altText: z.string().max(180).optional(),
  tags: z.array(z.string().trim().min(1).max(80)).optional(),
  context: z
    .object({
      usage: z.string().max(80).optional(),
      relatedModel: z.string().max(80).optional(),
      relatedId: objectId.optional()
    })
    .optional(),
  metadata: z.record(z.any()).optional()
});

const adminUserCreateSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(200),
  role: z.enum(adminRoles).optional(),
  active: z.boolean().optional()
});

const adminUserUpdateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).max(200).optional(),
  role: z.enum(adminRoles).optional(),
  active: z.boolean().optional()
});

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseBoolean = (value) => {
  if (value === undefined) return undefined;
  if (value === "true" || value === true) return true;
  if (value === "false" || value === false) return false;
  return undefined;
};

const parseDateRange = ({ from, to }, field) => {
  const range = {};
  if (from) range.$gte = new Date(from);
  if (to) range.$lte = new Date(to);
  return Object.keys(range).length ? { [field]: range } : {};
};

const pagination = (req, defaultLimit = 25) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || defaultLimit), 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

const paginate = async ({ model, query = {}, req, res, message, sort = { createdAt: -1 }, populate, select }) => {
  const { page, limit, skip } = pagination(req);
  let findQuery = model.find(query).sort(sort).skip(skip).limit(limit);
  if (populate) findQuery = findQuery.populate(populate);
  if (select) findQuery = findQuery.select(select);

  const [items, total] = await Promise.all([findQuery.lean(), model.countDocuments(query)]);
  ok(res, message, {
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
};

const findByIdOr404 = async (model, id) => {
  const parsedId = objectId.parse(id);
  const item = await model.findById(parsedId);
  if (!item) {
    const error = new Error("Record not found.");
    error.statusCode = 404;
    throw error;
  }
  return item;
};

const countByField = async (model, field, query = {}) =>
  model.aggregate([
    { $match: query },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

const assertEditableTemplate = (template) => {
  if (template.editable === false) {
    const error = new Error("This email template is locked and cannot be edited.");
    error.statusCode = 403;
    throw error;
  }
};

const ensureAnotherActiveAdmin = async (admin) => {
  if (admin.role !== "admin" || !admin.active) return;
  const activeAdminCount = await AdminUser.countDocuments({
    _id: { $ne: admin._id },
    role: "admin",
    active: true
  });
  if (activeAdminCount === 0) {
    const error = new Error("At least one active admin account is required.");
    error.statusCode = 422;
    throw error;
  }
};

const toAbsoluteUrl = (value) => {
  const rawValue = String(value || "/assessment").trim();
  if (/^(https?:|mailto:|tel:)/i.test(rawValue)) return rawValue;

  const appUrl = String(env.appUrl || env.frontendUrl || "http://localhost:5173").replace(/\/+$/, "");
  return rawValue.startsWith("/") ? `${appUrl}${rawValue}` : `${appUrl}/${rawValue}`;
};

const oneToOneCallCtaText = "Book a 1:1 Call";
const earnedCredibilityApplicationPath = "/application/earned-credibility-intensive";

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

const getRecordId = (value) => value?._id || value || undefined;

const assessmentContext = (result) => ({
  overallScore: Number(result.overallScore || 0),
  weakestCategory: result.weakestCategory,
  secondWeakestCategory: result.secondWeakestCategory,
  profession: result.participant?.profession,
  businessStage: result.participant?.businessStage,
  primaryChallenge: result.participant?.primaryChallenge,
  desiredOutcome: result.participant?.desiredOutcome,
  readinessToInvest: result.participant?.readinessToInvest
});

const selectExpectedScoreRange = (scoreRanges, score) =>
  scoreRanges.find((range) => Number(score) >= range.minScore && Number(score) <= range.maxScore) || null;

const buildResultReview = (result, expectedRange, recommendationRule) => {
  const storedStage = result.credibilityStage || {};
  const recommendationSnapshot =
    buildRecommendationSnapshot(recommendationRule) || result.recommendationSnapshot || {};
  const expectedStageName = expectedRange?.name || "";
  const storedStageName = storedStage.name || "";
  const alignedWithExpected = Boolean(expectedStageName && storedStageName && expectedStageName === storedStageName);
  const gradeStatus = expectedStageName && storedStageName ? (alignedWithExpected ? "aligned" : "needs_review") : "unknown";
  const fallbackCtaUrl =
    recommendationSnapshot.ctaDestination ||
    expectedRange?.primaryCtaUrl ||
    storedStage.primaryCtaUrl ||
    "/assessment";
  const nextActionCta = resolveEmailCta({
    text:
      recommendationSnapshot.ctaText ||
      expectedRange?.primaryCtaText ||
      storedStage.primaryCtaText,
    url: fallbackCtaUrl
  });

  return {
    score: Number(result.overallScore || 0),
    scoreMax: Number(result.overallMaxScore || result.scoringSnapshot?.overallMaxScore || 100),
    grade: expectedStageName || storedStageName || "Unassigned",
    gradeStatus,
    alignedWithExpected,
    storedStage: {
      name: storedStageName || "Unassigned",
      description: storedStage.description || "",
      recommendedAction: storedStage.recommendedAction || "",
      primaryCtaText: storedStage.primaryCtaText || "",
      primaryCtaUrl: storedStage.primaryCtaUrl ? toAbsoluteUrl(storedStage.primaryCtaUrl) : ""
    },
    expectedStage: expectedRange
      ? {
          name: expectedRange.name,
          minScore: expectedRange.minScore,
          maxScore: expectedRange.maxScore,
          description: expectedRange.description,
          recommendedAction: expectedRange.recommendedAction || "",
          primaryCtaText: expectedRange.primaryCtaText || "",
          primaryCtaUrl: expectedRange.primaryCtaUrl ? toAbsoluteUrl(expectedRange.primaryCtaUrl) : ""
        }
      : null,
    nextAction: {
      explanation:
        recommendationSnapshot.explanation ||
        expectedRange?.recommendedAction ||
        storedStage.recommendedAction ||
        "Review the assessment result and choose the next trust-building action.",
      ctaText:
        nextActionCta.ctaText ||
        "View recommended next step",
      ctaUrl: nextActionCta.ctaUrl,
      secondaryAction: recommendationSnapshot.secondaryAction || null,
      emailSequenceKey: recommendationSnapshot.emailSequenceKey || recommendationRule?.emailSequenceKey || ""
    },
    recommendationRule: recommendationRule
      ? {
          id: recommendationRule._id,
          name: recommendationRule.name,
          priority: recommendationRule.priority,
          emailSequenceKey: recommendationRule.emailSequenceKey || ""
        }
      : null
  };
};

export const getPlatformReadiness = asyncHandler(async (req, res) => {
  const [activeAssessment, activeOffers, activeTemplateCount, activeSequenceCount] = await Promise.all([
    AssessmentVersion.findOne({ status: "active" }).select("title version").lean(),
    Offer.find({ active: true, slug: { $in: launchOfferSlugs } }).select("slug name ctaType").lean(),
    EmailTemplate.countDocuments({ active: true }),
    EmailSequence.countDocuments({ active: true })
  ]);
  const activeOfferSlugs = activeOffers.map((offer) => offer.slug);
  const missingOffers = launchOfferSlugs.filter((slug) => !activeOfferSlugs.includes(slug));
  const hasResend = Boolean(env.resendApiKey && env.emailFrom);
  const hasCloudinary = Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret);
  const isPublicUrl = /^https?:\/\/(?!localhost|127\.0\.0\.1)/i.test(env.appUrl || "");

  ok(res, "Platform readiness loaded.", {
    environment: env.isProduction ? "production" : "development",
    checks: [
      {
        key: "database",
        label: "Database",
        state: mongoose.connection.readyState === 1 ? "ready" : "needs_attention",
        detail: mongoose.connection.readyState === 1 ? "Connected and responding." : "The database is not connected."
      },
      {
        key: "email",
        label: "Email delivery",
        state: hasResend ? "ready" : "needs_configuration",
        detail: hasResend ? "Resend sender credentials are available." : "Add a verified Resend sender and API key."
      },
      {
        key: "media",
        label: "Media optimisation",
        state: hasCloudinary ? "ready" : "needs_configuration",
        detail: hasCloudinary ? "Cloudinary credentials are available." : "Add the Cloudinary cloud name and API credentials."
      },
      {
        key: "worker",
        label: "Email worker",
        state: env.enableEmailWorker ? "ready" : "needs_attention",
        detail: env.enableEmailWorker ? "Scheduled email delivery is enabled." : "Email delivery is paused by environment configuration."
      },
      {
        key: "public_url",
        label: "Public URL",
        state: isPublicUrl ? "ready" : "needs_configuration",
        detail: isPublicUrl ? "A non-local public URL is configured." : "Set APP_URL to the live public site before launch."
      },
      {
        key: "assessment",
        label: "Assessment",
        state: activeAssessment ? "ready" : "needs_attention",
        detail: activeAssessment ? `${activeAssessment.title} v${activeAssessment.version} is live.` : "Activate an assessment version before launch."
      },
      {
        key: "templates",
        label: "Email templates",
        state: activeTemplateCount ? "ready" : "needs_attention",
        detail: activeTemplateCount ? `${activeTemplateCount} active templates are available.` : "Activate the email templates needed for each journey."
      },
      {
        key: "sequences",
        label: "Email sequences",
        state: activeSequenceCount ? "ready" : "needs_attention",
        detail: activeSequenceCount ? `${activeSequenceCount} active sequence${activeSequenceCount === 1 ? "" : "s"} available.` : "Review the Code of Resonance and assessment follow-up sequences."
      }
    ],
    offerCatalogue: {
      expected: launchOfferSlugs.length,
      active: activeOfferSlugs.length,
      missing: missingOffers,
      offers: activeOffers
    }
  });
});

export const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalLeads,
    newLeads,
    assessmentResults,
    newMessages,
    pendingEmails,
    failedEmails,
    applications,
    newApplications,
    bookings,
    upcomingBookings,
    activeOffers,
    activeResources,
    mediaAssets,
    codeOfResonanceEntries,
    publishedCodeOfResonanceEntries,
    draftCodeOfResonanceEntries,
    activeAssessment,
    leadsByStatus,
    resultsByStage,
    emailsByStatus,
    recentLeads,
    recentResults,
    recentMessages
  ] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: "New" }),
    AssessmentResult.countDocuments(),
    ContactMessage.countDocuments({ status: "new" }),
    ScheduledEmail.countDocuments({ status: "pending" }),
    ScheduledEmail.countDocuments({ status: "failed" }),
    Application.countDocuments(),
    Application.countDocuments({ status: "new" }),
    Booking.countDocuments(),
    Booking.countDocuments({
      status: { $in: ["requested", "scheduled", "rescheduled"] },
      $or: [{ scheduledFor: { $gte: new Date() } }, { scheduledFor: { $exists: false } }, { scheduledFor: null }]
    }),
    Offer.countDocuments({ active: true }),
    Resource.countDocuments({ active: true }),
    MediaAsset.countDocuments(),
    CodeOfResonanceEntry.countDocuments(),
    CodeOfResonanceEntry.countDocuments({ status: "published" }),
    CodeOfResonanceEntry.countDocuments({ status: "draft" }),
    AssessmentVersion.findOne({ status: "active" }).sort({ version: -1, activeFrom: -1 }).lean(),
    countByField(Lead, "status"),
    countByField(AssessmentResult, "credibilityStage.name"),
    countByField(ScheduledEmail, "status"),
    Lead.find().sort({ createdAt: -1 }).limit(8).lean(),
    AssessmentResult.find()
      .sort({ submittedAt: -1 })
      .limit(8)
      .select("participant overallScore weakestCategory credibilityStage submittedAt lead")
      .populate("lead", "status tags")
      .lean(),
    ContactMessage.find().sort({ createdAt: -1 }).limit(8).populate("lead", "status").lean()
  ]);

  ok(res, "Admin dashboard loaded.", {
    totals: {
      totalLeads,
      newLeads,
      assessmentResults,
      newMessages,
      pendingEmails,
      failedEmails,
      applications,
      newApplications,
      bookings,
      upcomingBookings,
      activeOffers,
      activeResources,
      mediaAssets,
      codeOfResonanceEntries,
      publishedCodeOfResonanceEntries,
      draftCodeOfResonanceEntries
    },
    activeAssessment,
    charts: {
      leadsByStatus,
      resultsByStage,
      emailsByStatus
    },
    recent: {
      leads: recentLeads,
      assessmentResults: recentResults,
      contactMessages: recentMessages
    }
  });
});

export const listLeads = asyncHandler((req, res) => {
  const query = {};
  if (req.query.status) query.status = req.query.status;
  if (req.query.tag) query.tags = req.query.tag;
  if (req.query.leadSource) query.leadSource = req.query.leadSource;
  if (req.query.weakestCategory) query.weakestCategory = req.query.weakestCategory;
  if (req.query.minScore || req.query.maxScore) {
    query.assessmentScore = {};
    if (req.query.minScore) query.assessmentScore.$gte = Number(req.query.minScore);
    if (req.query.maxScore) query.assessmentScore.$lte = Number(req.query.maxScore);
  }
  const marketing = parseBoolean(req.query.marketingConsent);
  if (marketing !== undefined) query["communicationPreferences.marketing"] = marketing;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "i");
    query.$or = [{ email: regex }, { firstName: regex }, { lastName: regex }, { profession: regex }];
  }

  return paginate({
    model: Lead,
    query,
    req,
    res,
    message: "Leads loaded.",
    populate: [
      { path: "recommendedOffer", select: "name slug offerType price currency" },
      { path: "recommendedResource", select: "title slug resourceType" }
    ]
  });
});

export const getLead = asyncHandler(async (req, res) => {
  const id = objectId.parse(req.params.id);
  const [lead, assessmentResults, contactMessages, scheduledEmails] = await Promise.all([
    Lead.findById(id).populate("recommendedOffer recommendedResource").lean(),
    AssessmentResult.find({ lead: id }).sort({ submittedAt: -1 }).limit(10).lean(),
    ContactMessage.find({ lead: id }).sort({ createdAt: -1 }).limit(10).lean(),
    ScheduledEmail.find({ relatedLead: id })
      .sort({ scheduledFor: -1 })
      .limit(20)
      .populate("template", "key name type subject")
      .lean()
  ]);

  if (!lead) {
    return res.status(404).json({ success: false, message: "Lead not found.", errors: [] });
  }

  ok(res, "Lead loaded.", { lead, assessmentResults, contactMessages, scheduledEmails });
});

export const updateLead = asyncHandler(async (req, res) => {
  const payload = leadUpdateSchema.parse(req.body);
  const lead = await findByIdOr404(Lead, req.params.id);
  Object.assign(lead, payload, { lastInteractionAt: new Date() });
  await lead.save();
  ok(res, "Lead updated.", { lead });
});

export const addLeadNote = asyncHandler(async (req, res) => {
  const payload = leadNoteSchema.parse(req.body);
  const lead = await findByIdOr404(Lead, req.params.id);
  lead.internalNotes.push({
    note: payload.note,
    createdBy: req.user.sub,
    createdAt: new Date()
  });
  lead.lastInteractionAt = new Date();
  await lead.save();
  ok(res, "Lead note added.", { lead });
});

export const listAssessmentResults = asyncHandler(async (req, res) => {
  const query = {
    ...parseDateRange({ from: req.query.from, to: req.query.to }, "submittedAt")
  };
  if (req.query.email) query["participant.email"] = new RegExp(escapeRegex(req.query.email), "i");
  if (req.query.stage) query["credibilityStage.name"] = req.query.stage;
  if (req.query.weakestCategory) query["weakestCategory.key"] = req.query.weakestCategory;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "i");
    query.$or = [
      { "participant.email": regex },
      { "participant.firstName": regex },
      { "participant.lastName": regex },
      { "participant.profession": regex },
      { "credibilityStage.name": regex }
    ];
  }
  if (req.query.minScore || req.query.maxScore) {
    query.overallScore = {};
    if (req.query.minScore) query.overallScore.$gte = Number(req.query.minScore);
    if (req.query.maxScore) query.overallScore.$lte = Number(req.query.maxScore);
  }

  const { page, limit, skip } = pagination(req);
  const [items, total, scoreRanges] = await Promise.all([
    AssessmentResult.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "participant overallScore overallMaxScore categoryScores strongestCategory weakestCategory secondWeakestCategory credibilityStage recommendationSnapshot submittedAt lead scoringSnapshot"
      )
      .populate([
        { path: "lead", select: "firstName lastName email status tags" },
        { path: "recommendationSnapshot.offer", select: "name slug offerType price currency" },
        { path: "recommendationSnapshot.resource", select: "title slug resourceType" }
      ])
      .lean(),
    AssessmentResult.countDocuments(query),
    ScoreRange.find({ active: true }).sort({ displayOrder: 1, minScore: 1 }).lean()
  ]);

  ok(res, "Assessment results loaded.", {
    items: items.map((item) => ({
      ...item,
      review: buildResultReview(item, selectExpectedScoreRange(scoreRanges, item.overallScore), null)
    })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

export const getAssessmentResult = asyncHandler(async (req, res) => {
  const id = objectId.parse(req.params.id);
  const result = await AssessmentResult.findById(id)
    .populate("lead")
    .populate("assessmentVersion", "title version status")
    .populate("scoreRange", "name minScore maxScore")
    .populate("recommendationSnapshot.offer", "name slug offerType price currency ctaText ctaUrl")
    .populate("recommendationSnapshot.resource", "title slug resourceType externalUrl fileUrl")
    .lean();

  if (!result) {
    return res.status(404).json({ success: false, message: "Assessment result not found.", errors: [] });
  }

  const [expectedRange, recommendationRule] = await Promise.all([
    findScoreRange(result.overallScore),
    selectRecommendationRule(assessmentContext(result))
  ]);

  ok(res, "Assessment result loaded.", {
    result,
    review: buildResultReview(result, expectedRange, recommendationRule)
  });
});

export const sendAssessmentRecommendationEmail = asyncHandler(async (req, res) => {
  const id = objectId.parse(req.params.id);
  const result = await AssessmentResult.findById(id)
    .populate("lead")
    .populate("recommendationSnapshot.offer", "name slug offerType price currency ctaText ctaUrl")
    .populate("recommendationSnapshot.resource", "title slug resourceType externalUrl fileUrl")
    .lean();

  if (!result) {
    return res.status(404).json({ success: false, message: "Assessment result not found.", errors: [] });
  }

  const [expectedRange, recommendationRule] = await Promise.all([
    findScoreRange(result.overallScore),
    selectRecommendationRule(assessmentContext(result))
  ]);
  const review = buildResultReview(result, expectedRange, recommendationRule);
  const recipientName =
    [result.participant?.firstName, result.participant?.lastName].filter(Boolean).join(" ") ||
    result.participant?.email;

  const queuedEmail = await queueAndAttemptEmail({
    to: result.participant.email,
    name: recipientName,
    templateKey: "assessment_next_action",
    relatedLead: getRecordId(result.lead),
    relatedAssessment: result._id,
    relatedOffer: getRecordId(recommendationRule?.offer) || getRecordId(result.recommendationSnapshot?.offer),
    metadata: {
      source: "admin_results_dashboard",
      expectedStage: review.expectedStage?.name,
      storedStage: review.storedStage?.name,
      alignedWithExpected: review.alignedWithExpected,
      emailSequenceKey: review.nextAction.emailSequenceKey
    },
    variables: {
      firstName: result.participant?.firstName || "there",
      score: result.overallScore,
      scoreMax: result.overallMaxScore || result.scoringSnapshot?.overallMaxScore || 100,
      grade: review.grade,
      storedStage: review.storedStage?.name || "Unassigned",
      expectedStage: review.expectedStage?.name || review.grade,
      weakestCategory: result.weakestCategory?.name || "your lowest-scoring dimension",
      strongestCategory: result.strongestCategory?.name || "your strongest dimension",
      recommendedAction: review.nextAction.explanation,
      ctaText: review.nextAction.ctaText,
      ctaUrl: review.nextAction.ctaUrl
    }
  });

  ok(
    res,
    queuedEmail.delivery.status === "sent"
      ? "Next-action email sent."
      : "Next-action email queued. Immediate delivery will retry through the email queue.",
    {
      email: queuedEmail.email,
      review,
      delivery: queuedEmail.delivery
    }
  );
});

export const listContactMessages = asyncHandler((req, res) => {
  const query = {
    ...parseDateRange({ from: req.query.from, to: req.query.to }, "createdAt")
  };
  if (req.query.status) query.status = req.query.status;
  if (req.query.reason) query.reason = req.query.reason;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "i");
    query.$or = [{ name: regex }, { email: regex }, { message: regex }, { profession: regex }];
  }

  return paginate({
    model: ContactMessage,
    query,
    req,
    res,
    message: "Contact messages loaded.",
    populate: { path: "lead", select: "firstName lastName email status tags" }
  });
});

export const getContactMessage = asyncHandler(async (req, res) => {
  const id = objectId.parse(req.params.id);
  const message = await ContactMessage.findById(id).populate("lead").lean();
  if (!message) {
    return res.status(404).json({ success: false, message: "Contact message not found.", errors: [] });
  }
  ok(res, "Contact message loaded.", { message });
});

export const updateContactMessage = asyncHandler(async (req, res) => {
  const payload = contactUpdateSchema.parse(req.body);
  const message = await findByIdOr404(ContactMessage, req.params.id);
  Object.assign(message, payload);
  await message.save();
  ok(res, "Contact message updated.", { message });
});

export const listApplications = asyncHandler((req, res) => {
  const query = {
    ...parseDateRange({ from: req.query.from, to: req.query.to }, "submittedAt")
  };
  if (applicationStatuses.includes(req.query.status)) query.status = req.query.status;
  if (req.query.offerSlug) query["offerSnapshot.slug"] = req.query.offerSlug;
  if (req.query.priority) query.priority = req.query.priority;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "i");
    query.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { profession: regex },
      { "offerSnapshot.name": regex },
      { primaryChallenge: regex },
      { desiredOutcome: regex }
    ];
  }

  return paginate({
    model: Application,
    query,
    req,
    res,
    message: "Applications loaded.",
    populate: [
      { path: "lead", select: "firstName lastName email status tags assessmentScore credibilityStage" },
      { path: "offer", select: "name slug offerType price currency ctaType" },
      { path: "reviewedBy", select: "name email role" }
    ]
  });
});

export const getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(objectId.parse(req.params.id))
    .populate("lead")
    .populate("offer")
    .populate("reviewedBy", "name email role")
    .lean();

  if (!application) {
    return res.status(404).json({ success: false, message: "Application not found.", errors: [] });
  }

  ok(res, "Application loaded.", { application });
});

export const updateApplication = asyncHandler(async (req, res) => {
  const payload = applicationUpdateSchema.parse(req.body);
  const application = await findByIdOr404(Application, req.params.id);
  const statusChanged = payload.status && payload.status !== application.status;

  Object.assign(application, payload);
  if (statusChanged) {
    application.reviewedBy = req.user.sub;
    application.reviewedAt = new Date();
  }
  await application.save();

  if (statusChanged && application.lead) {
    const leadStatusMap = {
      reviewing: "Applied",
      qualified: "Qualified",
      accepted: "Client",
      not_ready: "Not Ready",
      declined: "Not Ready",
      archived: "Archived"
    };
    const nextLeadStatus = leadStatusMap[payload.status];
    if (nextLeadStatus) {
      await Lead.findByIdAndUpdate(application.lead, {
        status: nextLeadStatus,
        lastInteractionAt: new Date()
      });
    }
  }

  let decisionEmail;
  if (statusChanged && ["accepted", "not_ready", "declined"].includes(application.status)) {
    const offer = application.offer ? await Offer.findById(application.offer).lean() : null;
    const isAccepted = application.status === "accepted";
    const appUrl = String(env.appUrl || env.frontendUrl || "http://localhost:5173").replace(/\/+$/, "");
    const bookingUrl =
      offer?.externalBookingUrl ||
      oneToOneBookingUrl() ||
      (offer?.slug ? `${appUrl}/booking/${offer.slug}` : `${appUrl}/contact`);
    const ctaText = isAccepted ? oneToOneCallCtaText : "Take the assessment";
    const ctaUrl = isAccepted ? bookingUrl : toAbsoluteUrl("/assessment");

    decisionEmail = await queueAndAttemptEmail({
      to: application.email,
      name: [application.firstName, application.lastName].filter(Boolean).join(" ") || application.email,
      templateKey: isAccepted ? "application_approved" : "application_not_ready",
      relatedLead: application.lead,
      relatedOffer: application.offer,
      idempotencyKey: `application-decision:${application._id}:${application.status}`,
      variables: isAccepted
        ? {
            firstName: application.firstName,
            offerName: application.offerSnapshot?.name || offer?.name || "this offer",
            bookingUrl
          }
        : {
            firstName: application.firstName,
            offerName: application.offerSnapshot?.name || offer?.name || "this offer",
            recommendedNextStep:
              application.decisionNote ||
              "The 7-minute Earned Credibility assessment will help you identify the most useful next move for your visibility, trust, and positioning.",
            ctaText,
            ctaUrl
          },
      metadata: {
        source: "application_decision",
        application: application._id,
        decision: application.status
      }
    });
  }

  const updatedApplication = await Application.findById(application._id)
    .populate("lead", "firstName lastName email status tags assessmentScore credibilityStage")
    .populate("offer", "name slug offerType price currency ctaType")
    .populate("reviewedBy", "name email role")
    .lean();

  ok(res, "Application updated.", {
    application: updatedApplication,
    decisionEmail: decisionEmail
      ? { id: decisionEmail.email._id, status: decisionEmail.delivery.status }
      : undefined
  });
});

export const listBookings = asyncHandler((req, res) => {
  const query = {
    ...parseDateRange({ from: req.query.from, to: req.query.to }, "scheduledFor")
  };
  if (bookingStatuses.includes(req.query.status)) query.status = req.query.status;
  if (req.query.offerSlug) query["offerSnapshot.slug"] = req.query.offerSlug;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "i");
    query.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { phone: regex },
      { sessionName: regex },
      { "offerSnapshot.name": regex }
    ];
  }

  return paginate({
    model: Booking,
    query,
    req,
    res,
    message: "Bookings loaded.",
    sort: { scheduledFor: 1, submittedAt: -1 },
    populate: [
      { path: "lead", select: "firstName lastName email status tags" },
      { path: "offer", select: "name slug offerType price currency ctaType" }
    ]
  });
});

export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(objectId.parse(req.params.id))
    .populate("lead")
    .populate("offer")
    .lean();

  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found.", errors: [] });
  }

  ok(res, "Booking loaded.", { booking });
});

export const updateBooking = asyncHandler(async (req, res) => {
  const payload = bookingUpdateSchema.parse(req.body);
  const booking = await findByIdOr404(Booking, req.params.id);
  const statusChanged = payload.status && payload.status !== booking.status;

  Object.assign(booking, payload);
  await booking.save();

  if (statusChanged && booking.lead) {
    const leadStatusMap = {
      requested: "Session Booked",
      scheduled: "Session Booked",
      rescheduled: "Session Booked",
      completed: "Completed",
      cancelled: "Nurturing",
      no_show: "Nurturing",
      archived: "Archived"
    };
    const nextLeadStatus = leadStatusMap[payload.status];
    if (nextLeadStatus) {
      await Lead.findByIdAndUpdate(booking.lead, {
        status: nextLeadStatus,
        lastInteractionAt: new Date()
      });
    }
  }

  const updatedBooking = await Booking.findById(booking._id)
    .populate("lead", "firstName lastName email status tags")
    .populate("offer", "name slug offerType price currency ctaType")
    .lean();

  ok(res, "Booking updated.", { booking: updatedBooking });
});

export const listReviews = asyncHandler((req, res) => {
  const query = {
    ...parseDateRange({ from: req.query.from, to: req.query.to }, "createdAt")
  };
  if (reviewStatuses.includes(req.query.status)) query.status = req.query.status;
  const featured = parseBoolean(req.query.featured);
  if (featured !== undefined) query.featured = featured;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "i");
    query.$or = [
      { name: regex },
      { email: regex },
      { role: regex },
      { headline: regex },
      { before: regex },
      { after: regex },
      { review: regex }
    ];
  }

  return paginate({
    model: Review,
    query,
    req,
    res,
    message: "Reviews loaded.",
    sort: { status: 1, featured: -1, createdAt: -1 },
    populate: { path: "lead", select: "firstName lastName email status tags" }
  });
});

export const updateReview = asyncHandler(async (req, res) => {
  const payload = reviewUpdateSchema.parse(req.body);
  const review = await findByIdOr404(Review, req.params.id);

  Object.assign(review, payload);

  if (payload.status === "published" && !review.publishedAt) {
    review.publishedAt = new Date();
  }

  if (payload.status && payload.status !== "published") {
    review.publishedAt = undefined;
  }

  await review.save();
  ok(res, "Review updated.", { review });
});

export const listEmailTemplates = asyncHandler((req, res) => {
  const query = {};
  if (req.query.type) query.type = req.query.type;
  const active = parseBoolean(req.query.active);
  if (active !== undefined) query.active = active;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "i");
    query.$or = [{ key: regex }, { name: regex }, { subject: regex }];
  }

  return paginate({
    model: EmailTemplate,
    query,
    req,
    res,
    message: "Email templates loaded.",
    sort: { type: 1, key: 1 }
  });
});

export const createEmailTemplate = asyncHandler(async (req, res) => {
  const payload = emailTemplateSchema.parse(req.body);
  const template = await EmailTemplate.create(payload);
  created(res, "Email template created.", { template });
});

export const updateEmailTemplate = asyncHandler(async (req, res) => {
  const payload = emailTemplateSchema.partial().parse(req.body);
  const template = await findByIdOr404(EmailTemplate, req.params.id);
  assertEditableTemplate(template);

  const contentChanged = ["subject", "preheader", "html", "text"].some(
    (key) => payload[key] !== undefined && payload[key] !== template[key]
  );
  Object.assign(template, payload);
  if (contentChanged) template.version += 1;
  await template.save();

  ok(res, "Email template updated.", { template });
});

export const getCodeOfResonanceAutomation = asyncHandler(async (req, res) => {
  const [sequence, universalTemplate, subscriberCount, scheduledByStatus] = await Promise.all([
    EmailSequence.findOne({ key: "code_of_resonance_5_day" }).populate("steps.template").lean(),
    EmailTemplate.findOne({ key: "code_resonance_universal" }).lean(),
    Lead.countDocuments({
      newsletterConsent: true,
      tags: "code-of-resonance-subscriber",
      unsubscribedAt: { $exists: false }
    }),
    ScheduledEmail.aggregate([
      { $match: { "metadata.sequenceKey": "code_of_resonance_5_day" } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
  ]);

  ok(res, "Code of Resonance automation loaded.", {
    sequence,
    universalTemplate,
    subscriberCount,
    scheduledByStatus
  });
});

export const updateCodeOfResonanceAutomationTemplate = asyncHandler(async (req, res) => {
  const payload = codeAutomationTemplateSchema.parse(req.body);
  const template = await findByIdOr404(EmailTemplate, req.params.id);

  if (template.type !== "code_resonance_sequence") {
    const error = new Error("Only Code of Resonance sequence templates can be edited here.");
    error.statusCode = 422;
    throw error;
  }

  assertEditableTemplate(template);
  const contentChanged = ["subject", "preheader", "html", "text"].some(
    (key) => payload[key] !== undefined && payload[key] !== template[key]
  );

  Object.assign(template, payload);
  if (contentChanged) template.version += 1;
  await template.save();

  ok(res, "Code of Resonance automation email updated.", { template });
});

export const listScheduledEmails = asyncHandler((req, res) => {
  const query = {
    ...parseDateRange({ from: req.query.from, to: req.query.to }, "scheduledFor")
  };
  if (req.query.status) query.status = req.query.status;
  if (req.query.templateKey) query.templateKey = req.query.templateKey;
  if (req.query.email) query["recipient.email"] = new RegExp(escapeRegex(req.query.email), "i");

  return paginate({
    model: ScheduledEmail,
    query,
    req,
    res,
    message: "Scheduled emails loaded.",
    sort: { scheduledFor: -1 },
    populate: [
      { path: "template", select: "key name type subject" },
      { path: "relatedLead", select: "firstName lastName email status" },
      { path: "relatedAssessment", select: "overallScore credibilityStage submittedAt" },
      { path: "relatedOffer", select: "name slug offerType" }
    ]
  });
});

export const updateScheduledEmail = asyncHandler(async (req, res) => {
  const payload = scheduledEmailUpdateSchema.parse(req.body);
  const email = await findByIdOr404(ScheduledEmail, req.params.id);
  if (email.status === "sent") {
    const error = new Error("Sent emails cannot be edited.");
    error.statusCode = 422;
    throw error;
  }
  Object.assign(email, payload);
  await email.save();
  ok(res, "Scheduled email updated.", { email });
});

export const retryScheduledEmail = asyncHandler(async (req, res) => {
  const email = await findByIdOr404(ScheduledEmail, req.params.id);
  if (email.status === "sent") {
    const error = new Error("Sent emails do not need to be retried.");
    error.statusCode = 422;
    throw error;
  }
  email.status = "pending";
  email.scheduledFor = new Date();
  email.lastError = undefined;
  await email.save();
  ok(res, "Scheduled email queued for retry.", { email });
});

export const cancelScheduledEmail = asyncHandler(async (req, res) => {
  const email = await findByIdOr404(ScheduledEmail, req.params.id);
  if (email.status === "sent") {
    const error = new Error("Sent emails cannot be cancelled.");
    error.statusCode = 422;
    throw error;
  }
  email.status = "cancelled";
  await email.save();
  ok(res, "Scheduled email cancelled.", { email });
});

export const listMediaAssets = asyncHandler((req, res) => {
  const query = {};
  if (req.query.resourceType) query.resourceType = req.query.resourceType;
  if (req.query.tag) query.tags = req.query.tag;
  if (req.query.usage) query["context.usage"] = req.query.usage;

  return paginate({
    model: MediaAsset,
    query,
    req,
    res,
    message: "Media assets loaded.",
    sort: { createdAt: -1 },
    populate: { path: "uploadedBy", select: "name email role" }
  });
});

export const updateMediaAsset = asyncHandler(async (req, res) => {
  const payload = mediaAssetUpdateSchema.parse(req.body);
  const media = await findByIdOr404(MediaAsset, req.params.id);
  Object.assign(media, payload);
  await media.save();
  ok(res, "Media asset updated.", { media });
});

export const listAdminUsers = asyncHandler(async (req, res) => {
  const active = parseBoolean(req.query.active);
  const query = {};
  if (req.query.role) query.role = req.query.role;
  if (active !== undefined) query.active = active;

  const users = await AdminUser.find(query).sort({ createdAt: -1 }).lean();
  ok(res, "Admin users loaded.", { users: users.map(adminPublicProfile) });
});

export const createAdminUser = asyncHandler(async (req, res) => {
  const payload = adminUserCreateSchema.parse(req.body);
  const passwordHash = await AdminUser.hashPassword(payload.password);
  const user = await AdminUser.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    passwordHash,
    role: payload.role || "content_editor",
    active: payload.active ?? true
  });

  created(res, "Admin user created.", { user: adminPublicProfile(user) });
});

export const updateAdminUser = asyncHandler(async (req, res) => {
  const payload = adminUserUpdateSchema.parse(req.body);
  const user = await findByIdOr404(AdminUser, req.params.id);

  if (payload.active === false || payload.role === "content_editor") {
    await ensureAnotherActiveAdmin(user);
  }

  if (payload.password) {
    user.passwordHash = await AdminUser.hashPassword(payload.password);
    user.refreshTokenVersion += 1;
  }

  if (payload.name !== undefined) user.name = payload.name;
  if (payload.email !== undefined) user.email = payload.email.toLowerCase();
  if (payload.role !== undefined) user.role = payload.role;
  if (payload.active !== undefined) user.active = payload.active;

  await user.save();
  ok(res, "Admin user updated.", { user: adminPublicProfile(user) });
});
