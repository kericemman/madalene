import { z } from "zod";
import { Lead } from "../models/Lead.js";
import { Review } from "../models/Review.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/apiResponse.js";

const reviewSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  role: z.string().trim().max(140).optional(),
  headline: z.string().trim().max(140).optional(),
  before: z.string().trim().max(700).optional(),
  after: z.string().trim().max(700).optional(),
  review: z.string().trim().min(20).max(1600),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  source: z.string().trim().max(80).optional(),
  consent: z.literal(true)
});

const publicReviewFields = "name role headline before after review rating featured publishedAt createdAt";

const splitName = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ")
  };
};

export const listPublicReviews = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit || 12), 1), 60);

  const reviews = await Review.find({
    status: "published",
    displayConsent: true
  })
    .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .select(publicReviewFields)
    .lean();

  ok(res, "Reviews loaded.", { reviews });
});

export const submitReview = asyncHandler(async (req, res) => {
  const data = reviewSchema.parse(req.body);
  const email = data.email.toLowerCase();
  const names = splitName(data.name);
  const now = new Date();

  const lead = await Lead.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        firstName: names.firstName,
        lastName: names.lastName,
        email,
        profession: data.role,
        leadSource: data.source || "about_page_review_modal",
        status: "New"
      },
      $set: {
        ...(data.role ? { profession: data.role } : {}),
        lastInteractionAt: now
      },
      $addToSet: {
        tags: "review-submitter"
      }
    },
    { new: true, upsert: true }
  );

  const review = await Review.create({
    name: data.name,
    email,
    role: data.role,
    headline: data.headline,
    before: data.before,
    after: data.after,
    review: data.review,
    rating: data.rating,
    displayConsent: data.consent,
    consentAt: now,
    source: data.source || "about_page_review_modal",
    status: "pending",
    lead: lead._id
  });

  created(res, "Thank you for sharing your review. It will appear after admin approval.", {
    reviewId: review._id,
    status: review.status
  });
});
