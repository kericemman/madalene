import mongoose from "mongoose";
import slugify from "slugify";

const AssessmentCategorySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    weight: { type: Number, default: 1, min: 0 },
    displayOrder: { type: Number, default: 0 }
  },
  { _id: false }
);

const AssessmentVersionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    version: { type: Number, required: true, default: 1 },
    description: { type: String, trim: true },
    estimatedMinutes: { type: Number, default: 7 },
    scoringMode: {
      type: String,
      enum: ["percentage", "raw_total"],
      default: "percentage"
    },
    scoreDisplayMax: { type: Number, default: 100, min: 1, max: 1000 },
    aiScoringWeight: { type: Number, default: 0, min: 0, max: 1 },
    aiScoringMode: {
      type: String,
      enum: ["explanation_only", "evidence_rules"],
      default: "explanation_only"
    },
    aiAnalysisEnabled: { type: Boolean, default: false },
    categories: [AssessmentCategorySchema],
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft"
    },
    activeFrom: Date,
    activeUntil: Date
  },
  { timestamps: true }
);

AssessmentVersionSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

AssessmentVersionSchema.index({ slug: 1, version: 1 }, { unique: true });
AssessmentVersionSchema.index({ status: 1 });

export const AssessmentVersion = mongoose.model("AssessmentVersion", AssessmentVersionSchema);
