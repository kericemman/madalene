import mongoose from "mongoose";

const RuleCriteriaSchema = new mongoose.Schema(
  {
    minScore: { type: Number, min: 0, max: 100 },
    maxScore: { type: Number, min: 0, max: 100 },
    weakestCategories: [{ type: String, trim: true }],
    secondWeakestCategories: [{ type: String, trim: true }],
    professions: [{ type: String, trim: true }],
    businessStages: [{ type: String, trim: true }],
    primaryChallenges: [{ type: String, trim: true }],
    readinessToInvest: [{ type: String, trim: true }],
    desiredOutcomes: [{ type: String, trim: true }]
  },
  { _id: false }
);

const RecommendationRuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    priority: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    criteria: { type: RuleCriteriaSchema, default: {} },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
    resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
    explanation: { type: String, required: true, trim: true },
    ctaText: { type: String, required: true, trim: true },
    ctaDestination: { type: String, required: true, trim: true },
    secondaryAction: {
      label: { type: String, trim: true },
      url: { type: String, trim: true }
    },
    emailSequenceKey: { type: String, trim: true }
  },
  { timestamps: true }
);

RecommendationRuleSchema.index({ active: 1, priority: -1 });

export const RecommendationRule = mongoose.model("RecommendationRule", RecommendationRuleSchema);
