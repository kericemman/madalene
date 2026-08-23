import mongoose from "mongoose";
import validator from "validator";

const ApplicationSchema = new mongoose.Schema(
  {
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
    offerSnapshot: {
      name: { type: String, trim: true },
      slug: { type: String, trim: true },
      offerType: { type: String, trim: true }
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "A valid email is required."]
    },
    phone: { type: String, trim: true },
    profession: { type: String, trim: true },
    industry: { type: String, trim: true },
    businessStage: { type: String, trim: true },
    website: { type: String, trim: true },
    linkedInProfile: { type: String, trim: true },
    country: { type: String, trim: true },
    primaryChallenge: { type: String, trim: true },
    desiredOutcome: { type: String, trim: true },
    readinessToInvest: { type: String, trim: true },
    whyNow: { type: String, trim: true },
    supportNeeded: { type: String, trim: true },
    message: { type: String, trim: true },
    source: { type: String, default: "offer_application", trim: true },
    status: {
      type: String,
      enum: ["new", "reviewing", "qualified", "not_ready", "accepted", "declined", "archived"],
      default: "new"
    },
    priority: {
      type: String,
      enum: ["normal", "high", "urgent"],
      default: "normal"
    },
    decisionNote: { type: String, trim: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" },
    reviewedAt: Date,
    consent: { type: Boolean, required: true },
    consentAt: { type: Date },
    idempotencyKey: { type: String, trim: true },
    utm: {
      source: String,
      medium: String,
      campaign: String,
      term: String,
      content: String
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

ApplicationSchema.index({ email: 1 });
ApplicationSchema.index({ lead: 1, submittedAt: -1 });
ApplicationSchema.index({ status: 1, submittedAt: -1 });
ApplicationSchema.index({ "offerSnapshot.slug": 1, submittedAt: -1 });
ApplicationSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });

export const Application = mongoose.model("Application", ApplicationSchema);
