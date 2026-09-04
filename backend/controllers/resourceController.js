import { AssessmentResult } from "../models/AssessmentResult.js";
import { Resource } from "../models/Resource.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/apiResponse.js";
import { hashTokenCandidates } from "../utils/tokenUtils.js";
import { sanitizeRichHtml } from "../utils/sanitizeHtml.js";

const resourceGapThreshold = 70;

const normalizeId = (value) => {
  if (!value) return "";
  if (value._id) return String(value._id);
  return String(value);
};

const normalizeSlug = (value) => String(value || "").trim().toLowerCase();

const hasDirectResourceMatch = (resource, result) => {
  const resourceId = normalizeId(resource);
  const resourceSlug = normalizeSlug(resource.slug);
  const stageResource = result.stageResource || {};
  const recommendationResourceId = normalizeId(result.recommendationSnapshot?.resource);

  if (normalizeId(stageResource.resource) === resourceId) return true;
  if (normalizeSlug(stageResource.slug) === resourceSlug) return true;
  if (recommendationResourceId && recommendationResourceId === resourceId) return true;

  return (result.gapResources || []).some((gapResource) => {
    return normalizeId(gapResource.resource) === resourceId || normalizeSlug(gapResource.slug) === resourceSlug;
  });
};

const hasAssessmentContextMatch = (resource, result) => {
  const relatedGap = normalizeSlug(resource.relatedWeakestCategory);
  const relatedStage = String(resource.relatedAssessmentScoreRange || "").trim();

  const categoryMatches =
    relatedGap &&
    (normalizeSlug(result.weakestCategory?.key) === relatedGap ||
      normalizeSlug(result.secondWeakestCategory?.key) === relatedGap ||
      (result.categoryScores || []).some(
        (category) => normalizeSlug(category.key) === relatedGap && Number(category.score || 0) < resourceGapThreshold
      ));

  const stageMatches = relatedStage && relatedStage === String(result.credibilityStage?.name || "").trim();

  return Boolean(categoryMatches || stageMatches);
};

const canReadResource = (resource, result) =>
  hasDirectResourceMatch(resource, result) || hasAssessmentContextMatch(resource, result);

const publicResourcePayload = (resource, result) => ({
  id: resource._id,
  title: resource.title,
  slug: resource.slug,
  description: resource.description,
  resourceType: resource.resourceType,
  category: resource.category,
  relatedAssessmentScoreRange: resource.relatedAssessmentScoreRange,
  relatedWeakestCategory: resource.relatedWeakestCategory,
  coverImage: resource.coverImage,
  relatedOffer: resource.relatedOffer,
  content: {
    subject: resource.emailDelivery?.subject,
    preheader: resource.emailDelivery?.preheader,
    title: resource.emailDelivery?.title || resource.title,
    intro: resource.emailDelivery?.intro || resource.description,
    bodyHtml: sanitizeRichHtml(resource.emailDelivery?.bodyHtml),
    text: resource.emailDelivery?.text || "",
    ctaText: resource.emailDelivery?.ctaText || "Book a 1:1 Call",
    ctaUrl: resource.emailDelivery?.ctaUrl || ""
  },
  recommendationContext: {
    stage: result.credibilityStage?.name,
    weakestCategory: result.weakestCategory,
    matchedGap: (result.gapResources || []).find(
      (gapResource) =>
        normalizeSlug(gapResource.slug) === normalizeSlug(resource.slug) ||
        normalizeId(gapResource.resource) === normalizeId(resource)
    )
  }
});

export const getRecommendedResource = asyncHandler(async (req, res) => {
  const token = String(req.query.token || "").trim();
  const slug = normalizeSlug(req.params.slug);

  if (!token || !slug) {
    return res.status(404).json({
      success: false,
      message: "This resource link is unavailable.",
      errors: []
    });
  }

  const [result, resource] = await Promise.all([
    AssessmentResult.findOne({
      resultTokenHash: { $in: hashTokenCandidates(token) },
      resultTokenExpiresAt: { $gt: new Date() }
    }).lean(),
    Resource.findOne({ slug, active: true })
      .populate("coverImage", "secureUrl optimizedUrl thumbnailUrl altText srcset width height")
      .populate("relatedOffer", "name slug ctaText ctaUrl")
      .lean()
  ]);

  if (!result || !resource || !canReadResource(resource, result)) {
    return res.status(404).json({
      success: false,
      message: "This resource link is unavailable.",
      errors: []
    });
  }

  await Resource.updateOne({ _id: resource._id }, { $inc: { downloadCount: 1 } });

  ok(res, "Recommended resource loaded.", {
    resource: publicResourcePayload(resource, result)
  });
});
