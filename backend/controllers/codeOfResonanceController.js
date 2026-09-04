import { CodeOfResonanceEntry, codeOfResonanceTypes } from "../models/CodeOfResonanceEntry.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/apiResponse.js";
import { sanitizeRichHtml } from "../utils/sanitizeHtml.js";

export const listPublicCodeOfResonanceEntries = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit || 6), 1), 24);
  const query = { status: "ready" };
  const sort =
    req.query.sort === "latest"
      ? { publishedAt: -1, updatedAt: -1, createdAt: -1 }
      : { featured: -1, displayOrder: 1, updatedAt: -1 };

  if (codeOfResonanceTypes.includes(req.query.contentType)) {
    query.contentType = req.query.contentType;
  }

  if (req.query.featured === "true") {
    query.featured = true;
  }

  const items = await CodeOfResonanceEntry.find(query)
    .sort(sort)
    .limit(limit)
    .select(
      "title slug contentType excerpt ctaText ctaUrl category tags coverImage readingTimeMinutes strategicGoal editorialPlan source caseStudy testimonial seo updatedAt publishedAt createdAt"
    )
    .populate("coverImage", "secureUrl optimizedUrl thumbnailUrl altText srcset")
    .lean();

  ok(res, "Code of Resonance entries loaded.", { items });
});

export const getPublicCodeOfResonanceEntry = asyncHandler(async (req, res) => {
  const entry = await CodeOfResonanceEntry.findOne({
    slug: req.params.slug,
    status: "ready"
  })
    .select(
      "title slug contentType excerpt body ctaText ctaUrl category tags coverImage readingTimeMinutes strategicGoal editorialPlan source caseStudy testimonial seo authorName updatedAt publishedAt"
    )
    .populate("coverImage", "secureUrl optimizedUrl thumbnailUrl altText srcset width height")
    .lean();

  if (!entry) {
    return res.status(404).json({
      success: false,
      message: "Code of Resonance entry not found.",
      errors: []
    });
  }

  ok(res, "Code of Resonance entry loaded.", {
    entry: {
      ...entry,
      body: sanitizeRichHtml(entry.body)
    }
  });
});
