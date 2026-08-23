import mongoose from "mongoose";
import validator from "validator";

const LeadSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
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
    leadSource: { type: String, trim: true },
    utm: {
      source: String,
      medium: String,
      campaign: String,
      term: String,
      content: String
    },
    assessmentScore: { type: Number, min: 0, max: 100 },
    credibilityStage: { type: String, trim: true },
    strongestCategory: { type: String, trim: true },
    weakestCategory: { type: String, trim: true },
    recommendedOffer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
    recommendedResource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
    newsletterConsent: { type: Boolean, default: false },
    marketingConsentAt: Date,
    consentVersion: { type: String, trim: true },
    status: {
      type: String,
      enum: [
        "New",
        "Assessment Completed",
        "Nurturing",
        "Guide Downloaded",
        "Audit Interested",
        "Audit Purchased",
        "Session Booked",
        "Applied",
        "Qualified",
        "Client",
        "Completed",
        "Not Ready",
        "Archived"
      ],
      default: "New"
    },
    tags: [{ type: String, trim: true }],
    internalNotes: [
      {
        note: { type: String, trim: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    lastInteractionAt: Date,
    unsubscribedAt: Date,
    communicationPreferences: {
      transactional: { type: Boolean, default: true },
      marketing: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

LeadSchema.index({ email: 1 }, { unique: true });
LeadSchema.index({ status: 1 });
LeadSchema.index({ assessmentScore: 1 });
LeadSchema.index({ weakestCategory: 1 });
LeadSchema.index({ leadSource: 1 });

export const Lead = mongoose.model("Lead", LeadSchema);
