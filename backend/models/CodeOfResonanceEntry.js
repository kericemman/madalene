import mongoose from "mongoose";
import slugify from "slugify";

export const codeOfResonanceTypes = [
  "guide",
  "essay",
  "trust_resonance",
  "reading_list",
  "case_study",
  "testimonial"
];

export const codeOfResonanceStatuses = ["idea", "outline", "draft", "review", "ready", "published", "archived"];

const CodeOfResonanceEntrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    contentType: {
      type: String,
      enum: codeOfResonanceTypes,
      required: true,
      default: "essay"
    },
    status: {
      type: String,
      enum: codeOfResonanceStatuses,
      default: "draft"
    },
    strategicGoal: {
      journeyStage: {
        type: String,
        enum: ["awareness", "belief_shift", "trust_building", "proof", "conversion", "retention"],
        default: "belief_shift"
      },
      audience: { type: String, trim: true },
      objective: { type: String, trim: true },
      readerShift: { type: String, trim: true },
      primaryCta: { type: String, trim: true },
      successMetric: { type: String, trim: true }
    },
    editorialPlan: {
      pillar: { type: String, trim: true },
      angle: { type: String, trim: true },
      coreQuestion: { type: String, trim: true },
      thesis: { type: String, trim: true },
      proofPoints: [{ type: String, trim: true }]
    },
    qualityChecks: {
      clearPromise: { type: Boolean, default: false },
      readerRelevance: { type: Boolean, default: false },
      trustSignal: { type: Boolean, default: false },
      emotionalResonance: { type: Boolean, default: false },
      specificProof: { type: Boolean, default: false },
      clearNextStep: { type: Boolean, default: false }
    },
    excerpt: { type: String, trim: true },
    body: { type: String, trim: true },
    ctaText: { type: String, trim: true },
    ctaUrl: { type: String, trim: true },
    category: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    coverImage: { type: mongoose.Schema.Types.ObjectId, ref: "MediaAsset" },
    authorName: { type: String, trim: true, default: "Magdalene Wambui" },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    readingTimeMinutes: { type: Number, min: 0 },
    publishedAt: Date,
    source: {
      title: { type: String, trim: true },
      author: { type: String, trim: true },
      url: { type: String, trim: true }
    },
    caseStudy: {
      clientName: { type: String, trim: true },
      challenge: { type: String, trim: true },
      result: { type: String, trim: true }
    },
    testimonial: {
      before: { type: String, trim: true },
      after: { type: String, trim: true },
      name: { type: String, trim: true },
      role: { type: String, trim: true }
    },
    seo: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      canonicalUrl: { type: String, trim: true },
      image: { type: mongoose.Schema.Types.ObjectId, ref: "MediaAsset" }
    },
    lastEditedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" }
  },
  { timestamps: true }
);

CodeOfResonanceEntrySchema.pre("validate", function prepareEntry(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  if (this.isModified("status") && this.status !== "published") {
    this.publishedAt = undefined;
  }

  next();
});

CodeOfResonanceEntrySchema.index({ slug: 1 }, { unique: true });
CodeOfResonanceEntrySchema.index({ status: 1, contentType: 1, displayOrder: 1 });
CodeOfResonanceEntrySchema.index({ featured: 1, status: 1 });
CodeOfResonanceEntrySchema.index({ tags: 1 });

export const CodeOfResonanceEntry = mongoose.model("CodeOfResonanceEntry", CodeOfResonanceEntrySchema);
