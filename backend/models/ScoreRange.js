import mongoose from "mongoose";

const ScoreRangeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    minScore: { type: Number, required: true, min: 0, max: 100 },
    maxScore: { type: Number, required: true, min: 0, max: 100 },
    description: { type: String, required: true, trim: true },
    recommendedAction: { type: String, trim: true },
    primaryCtaText: { type: String, trim: true },
    primaryCtaUrl: { type: String, trim: true },
    report: {
      whatItMeans: { type: String, trim: true },
      biggestOpportunity: { type: String, trim: true },
      nextSteps: [{ type: String, trim: true }],
      recommendedResourceTitle: { type: String, trim: true },
      finalNote: { type: String, trim: true }
    },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

ScoreRangeSchema.index({ active: 1, minScore: 1, maxScore: 1 });

export const ScoreRange = mongoose.model("ScoreRange", ScoreRangeSchema);
