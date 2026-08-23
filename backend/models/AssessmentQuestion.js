import mongoose from "mongoose";

const QuestionOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    score: { type: Number, default: 0 },
    displayOrder: { type: Number, default: 0 }
  },
  { _id: false }
);

const AssessmentQuestionSchema = new mongoose.Schema(
  {
    assessmentVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentVersion",
      required: true
    },
    key: { type: String, required: true, trim: true },
    questionText: { type: String, required: true, trim: true },
    helperText: { type: String, trim: true },
    categoryKey: { type: String, required: true, trim: true },
    displayOrder: { type: Number, default: 0 },
    answerType: {
      type: String,
      enum: ["likert", "multiple_choice", "single_choice", "yes_no", "short_text", "long_text"],
      required: true
    },
    options: [QuestionOptionSchema],
    minAnswerLength: { type: Number, default: 0, min: 0, max: 5000 },
    weight: { type: Number, default: 1, min: 0 },
    required: { type: Boolean, default: true },
    scored: { type: Boolean, default: true },
    aiScored: { type: Boolean, default: false },
    aiScoringRubric: { type: String, trim: true, maxlength: 2400 },
    active: { type: Boolean, default: true },
    conditionalLogic: { type: mongoose.Schema.Types.Mixed, default: null },
    versionNumber: { type: Number, default: 1 }
  },
  { timestamps: true }
);

AssessmentQuestionSchema.index({ assessmentVersion: 1, key: 1 }, { unique: true });
AssessmentQuestionSchema.index({ assessmentVersion: 1, categoryKey: 1, active: 1 });
AssessmentQuestionSchema.index({ assessmentVersion: 1, displayOrder: 1 });

export const AssessmentQuestion = mongoose.model("AssessmentQuestion", AssessmentQuestionSchema);
