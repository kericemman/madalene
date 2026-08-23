import mongoose from "mongoose";
import slugify from "slugify";

const OfferSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    shortDescription: { type: String, trim: true },
    fullDescription: { type: String, trim: true },
    price: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD", trim: true },
    offerType: {
      type: String,
      enum: [
        "free",
        "digital_product",
        "audit",
        "one_time_session",
        "intensive",
        "consulting_package",
        "application_only"
      ],
      required: true
    },
    deliveryMethod: { type: String, trim: true },
    features: [{ type: String, trim: true }],
    outcomes: [{ type: String, trim: true }],
    idealClient: { type: String, trim: true },
    ctaText: { type: String, trim: true },
    ctaType: {
      type: String,
      enum: ["checkout", "booking", "application", "external_url", "download"],
      default: "external_url"
    },
    ctaUrl: { type: String, trim: true },
    checkoutEnabled: { type: Boolean, default: false },
    bookingEnabled: { type: Boolean, default: false },
    applicationRequired: { type: Boolean, default: false },
    externalBookingUrl: { type: String, trim: true },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    relatedEmailSequenceKey: { type: String, trim: true }
  },
  { timestamps: true }
);

OfferSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

OfferSchema.index({ slug: 1 }, { unique: true });
OfferSchema.index({ active: 1, displayOrder: 1 });

export const Offer = mongoose.model("Offer", OfferSchema);
