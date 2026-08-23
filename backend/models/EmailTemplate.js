import mongoose from "mongoose";

const EmailTemplateSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: [
        "assessment_started",
        "assessment_completed",
        "assessment_next_action",
        "results_delivered",
        "free_guide_delivery",
        "newsletter_welcome",
        "code_resonance_sequence",
        "contact_confirmation",
        "admin_contact_notification",
        "purchase_confirmation",
        "payment_failed",
        "booking_confirmation",
        "booking_reminder",
        "booking_rescheduled",
        "booking_cancelled",
        "application_received",
        "application_approved",
        "application_not_ready",
        "client_intake_request",
        "deliverable_ready",
        "feedback_request",
        "testimonial_request",
        "custom"
      ],
      default: "custom"
    },
    subject: { type: String, required: true, trim: true },
    preheader: { type: String, trim: true },
    html: { type: String, required: true },
    text: { type: String },
    variables: [{ type: String, trim: true }],
    active: { type: Boolean, default: true },
    editable: { type: Boolean, default: true },
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

EmailTemplateSchema.index({ key: 1 }, { unique: true });
EmailTemplateSchema.index({ type: 1, active: 1 });

export const EmailTemplate = mongoose.model("EmailTemplate", EmailTemplateSchema);
