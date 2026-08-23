import mongoose from "mongoose";

const MediaAssetSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true, trim: true },
    assetId: { type: String, trim: true },
    originalFilename: { type: String, trim: true },
    displayName: { type: String, trim: true },
    altText: { type: String, trim: true },
    folder: { type: String, trim: true },
    resourceType: { type: String, enum: ["image", "video", "raw", "auto"], default: "image" },
    format: { type: String, trim: true },
    bytes: Number,
    width: Number,
    height: Number,
    secureUrl: { type: String, required: true },
    optimizedUrl: { type: String },
    thumbnailUrl: { type: String },
    srcset: [
      {
        width: Number,
        url: String
      }
    ],
    blurPlaceholderUrl: { type: String },
    tags: [{ type: String, trim: true }],
    context: {
      usage: { type: String, trim: true },
      relatedModel: { type: String, trim: true },
      relatedId: { type: mongoose.Schema.Types.ObjectId }
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

MediaAssetSchema.index({ publicId: 1 }, { unique: true });
MediaAssetSchema.index({ resourceType: 1 });
MediaAssetSchema.index({ tags: 1 });

export const MediaAsset = mongoose.model("MediaAsset", MediaAssetSchema);
