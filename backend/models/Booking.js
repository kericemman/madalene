import mongoose from "mongoose";
import validator from "validator";

const BookingSchema = new mongoose.Schema(
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
    sessionName: { type: String, trim: true },
    scheduledFor: Date,
    timezone: { type: String, trim: true },
    meetingUrl: { type: String, trim: true },
    externalBookingUrl: { type: String, trim: true },
    message: { type: String, trim: true },
    source: { type: String, default: "booking_request", trim: true },
    status: {
      type: String,
      enum: ["requested", "scheduled", "rescheduled", "completed", "cancelled", "no_show", "archived"],
      default: "requested"
    },
    internalNote: { type: String, trim: true },
    consent: { type: Boolean, required: true },
    consentAt: { type: Date },
    idempotencyKey: { type: String, trim: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

BookingSchema.index({ email: 1 });
BookingSchema.index({ lead: 1, submittedAt: -1 });
BookingSchema.index({ status: 1, scheduledFor: 1 });
BookingSchema.index({ "offerSnapshot.slug": 1, submittedAt: -1 });
BookingSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });

export const Booking = mongoose.model("Booking", BookingSchema);
