import mongoose from "mongoose";
import validator from "validator";

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "A valid email is required."]
    },
    profession: { type: String, trim: true },
    reason: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    consent: { type: Boolean, required: true },
    consentAt: { type: Date },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new"
    },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    source: { type: String, default: "contact_form" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

ContactMessageSchema.index({ email: 1 });
ContactMessageSchema.index({ status: 1, createdAt: -1 });

export const ContactMessage = mongoose.model("ContactMessage", ContactMessageSchema);
