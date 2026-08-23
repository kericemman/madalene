import mongoose from "mongoose";
import validator from "validator";

const ReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "A valid email is required."]
    },
    role: { type: String, trim: true },
    headline: { type: String, trim: true },
    before: { type: String, trim: true },
    after: { type: String, trim: true },
    review: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    displayConsent: { type: Boolean, required: true },
    consentAt: Date,
    status: {
      type: String,
      enum: ["pending", "published", "hidden", "flagged"],
      default: "pending"
    },
    featured: { type: Boolean, default: false },
    source: { type: String, trim: true, default: "about_page_review_modal" },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    publishedAt: Date
  },
  { timestamps: true }
);

ReviewSchema.index({ status: 1, displayConsent: 1, featured: -1, publishedAt: -1 });
ReviewSchema.index({ email: 1, createdAt: -1 });

export const Review = mongoose.model("Review", ReviewSchema);
