import mongoose from "mongoose";
import validator from "validator";

const ResultResponseSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: "AssessmentQuestion" },
    questionKey: { type: String, required: true, trim: true },
    questionText: { type: String, required: true, trim: true },
    categoryKey: { type: String, required: true, trim: true },
    answerType: { type: String, required: true, trim: true },
    value: { type: mongoose.Schema.Types.Mixed },
    scoreEarned: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    weight: { type: Number, default: 1 },
    scored: { type: Boolean, default: true }
  },
  { _id: false }
);

const CategoryScoreSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    weight: { type: Number, default: 1 },
    pointsEarned: { type: Number, default: 0 },
    maxPoints: { type: Number, default: 0 },
    score: { type: Number, min: 0, max: 100 },
    baseScore: { type: Number, min: 0, max: 100 },
    aiScore: { type: Number, min: 0, max: 100 },
    aiApplied: { type: Boolean, default: false },
    selfAssessmentPoints: { type: Number, min: 0 },
    evidencePoints: { type: Number, min: 0 },
    scoreDelta: { type: Number }
  },
  { _id: false }
);

const AssessmentResultSchema = new mongoose.Schema(
  {
    assessmentVersion: { type: mongoose.Schema.Types.ObjectId, ref: "AssessmentVersion", required: true },
    assessmentVersionNumber: { type: Number, required: true },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    participant: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, trim: true },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "A valid email is required."]
      },
      profession: { type: String, trim: true },
      businessStage: { type: String, trim: true },
      primaryChallenge: { type: String, trim: true },
      desiredOutcome: { type: String, trim: true },
      readinessToInvest: { type: String, trim: true },
      website: { type: String, trim: true },
      linkedInProfile: { type: String, trim: true },
      country: { type: String, trim: true },
      newsletterConsent: { type: Boolean, default: false },
      marketingConsentAt: Date,
      consentVersion: { type: String, trim: true }
    },
    responses: [ResultResponseSchema],
    categoryScores: [CategoryScoreSchema],
    overallScore: { type: Number, required: true, min: 0, max: 1000 },
    overallMaxScore: { type: Number, default: 100, min: 1, max: 1000 },
    strongestCategory: { key: String, name: String, score: Number },
    weakestCategory: { key: String, name: String, score: Number },
    secondWeakestCategory: { key: String, name: String, score: Number },
    scoreRange: { type: mongoose.Schema.Types.ObjectId, ref: "ScoreRange" },
    credibilityStage: {
      name: String,
      description: String,
      recommendedAction: String,
      primaryCtaText: String,
      primaryCtaUrl: String,
      report: {
        whatItMeans: String,
        biggestOpportunity: String,
        nextSteps: [String],
        recommendedResourceTitle: String,
        finalNote: String
      }
    },
    recommendationSnapshot: {
      rule: { type: mongoose.Schema.Types.ObjectId, ref: "RecommendationRule" },
      offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
      resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
      explanation: String,
      ctaText: String,
      ctaDestination: String,
      secondaryAction: {
        label: String,
        url: String
      },
      emailSequenceKey: String
    },
    stageResource: {
      resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
      title: String,
      description: String,
      slug: String
    },
    aiAnalysis: {
      status: {
        type: String,
        enum: ["not_requested", "pending", "complete", "fallback", "failed"],
        default: "not_requested"
      },
      model: String,
      promptVersion: String,
      generatedAt: Date,
      confidence: { type: Number, min: 0, max: 1 },
      categoryEvidence: [
        {
          key: String,
          name: String,
          score: { type: Number, min: 0, max: 5 },
          normalizedScore: { type: Number, min: 0, max: 100 },
          confidence: { type: Number, min: 0, max: 1 },
          evidence: [String],
          rationale: String
        }
      ],
      report: {
        headline: String,
        summary: String,
        earnedCredibility: String,
        gapInsights: [
          {
            categoryKey: String,
            title: String,
            detail: String
          }
        ],
        nextSteps: [String],
        emailOpening: String
      },
      fallbackReason: String,
      error: String
    },
    gapResources: [
      {
        categoryKey: String,
        categoryName: String,
        categoryScore: Number,
        resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
        title: String,
        description: String,
        slug: String
      }
    ],
    scoringSnapshot: { type: mongoose.Schema.Types.Mixed, required: true },
    resultTokenHash: { type: String, required: true },
    resultTokenExpiresAt: { type: Date, required: true },
    idempotencyKey: { type: String, trim: true },
    submittedAt: { type: Date, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

AssessmentResultSchema.index({ resultTokenHash: 1 }, { unique: true });
AssessmentResultSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });
AssessmentResultSchema.index({ "participant.email": 1 });
AssessmentResultSchema.index({ overallScore: 1 });
AssessmentResultSchema.index({ "weakestCategory.key": 1 });

export const AssessmentResult = mongoose.model("AssessmentResult", AssessmentResultSchema);
