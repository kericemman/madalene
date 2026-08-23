import mongoose from "mongoose";
import slugify from "slugify";

const ResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    description: { type: String, trim: true },
    resourceType: {
      type: String,
      enum: [
        "pdf_guide",
        "workbook",
        "checklist",
        "playbook",
        "blueprint",
        "reading_list",
        "video",
        "audio",
        "external_article",
        "template",
        "email_resource"
      ],
      required: true
    },
    coverImage: { type: mongoose.Schema.Types.ObjectId, ref: "MediaAsset" },
    fileUrl: { type: String, trim: true },
    externalUrl: { type: String, trim: true },
    price: { type: Number, default: 0, min: 0 },
    free: { type: Boolean, default: true },
    emailGated: { type: Boolean, default: true },
    category: { type: String, trim: true },
    relatedAssessmentScoreRange: { type: String, trim: true },
    relatedWeakestCategory: { type: String, trim: true },
    relatedOffer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
    emailDelivery: {
      subject: { type: String, trim: true },
      preheader: { type: String, trim: true },
      title: { type: String, trim: true },
      intro: { type: String, trim: true },
      bodyHtml: { type: String },
      text: { type: String },
      ctaText: { type: String, trim: true },
      ctaUrl: { type: String, trim: true }
    },
    active: { type: Boolean, default: true },
    downloadCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

ResourceSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

ResourceSchema.index({ slug: 1 }, { unique: true });
ResourceSchema.index({ active: 1, category: 1 });

export const Resource = mongoose.model("Resource", ResourceSchema);
