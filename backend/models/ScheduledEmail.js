import mongoose from "mongoose";
import validator from "validator";

const ScheduledEmailSchema = new mongoose.Schema(
  {
    recipient: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "A valid recipient email is required."]
      },
      name: { type: String, trim: true }
    },
    template: { type: mongoose.Schema.Types.ObjectId, ref: "EmailTemplate" },
    templateKey: { type: String, trim: true, lowercase: true },
    subjectSnapshot: { type: String, trim: true },
    htmlSnapshot: { type: String },
    textSnapshot: { type: String },
    variables: { type: mongoose.Schema.Types.Mixed, default: {} },
    scheduledFor: { type: Date, required: true },
    sentAt: Date,
    status: {
      type: String,
      enum: ["pending", "processing", "sent", "failed", "cancelled"],
      default: "pending"
    },
    attemptCount: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
    lastError: { type: String },
    provider: { type: String, default: "resend" },
    providerMessageId: { type: String, trim: true },
    idempotencyKey: { type: String, trim: true },
    relatedLead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    relatedAssessment: { type: mongoose.Schema.Types.ObjectId, ref: "AssessmentResult" },
    relatedOffer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

ScheduledEmailSchema.index({ scheduledFor: 1, status: 1 });
ScheduledEmailSchema.index({ "recipient.email": 1 });
ScheduledEmailSchema.index({ relatedLead: 1 });
ScheduledEmailSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });

export const ScheduledEmail = mongoose.model("ScheduledEmail", ScheduledEmailSchema);
