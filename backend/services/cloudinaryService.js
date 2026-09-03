import path from "node:path";
import { randomUUID } from "node:crypto";
import slugify from "slugify";
import { cloudinary } from "../config/cloudinary.js";
import { env } from "../config/env.js";

const imageWidths = [320, 640, 960, 1280, 1600];

const safeFolder = (folder = "") => {
  const parts = String(folder)
    .split("/")
    .map((part) => slugify(part, { lower: true, strict: true }))
    .filter(Boolean);

  return [env.cloudinary.defaultFolder, ...parts].filter(Boolean).join("/");
};

const uploadStream = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });

    stream.end(buffer);
  });

export const isCloudinaryConfigured = () =>
  Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret);

export const uploadBufferToCloudinary = async ({
  buffer,
  originalname,
  mimetype,
  folder,
  tags = [],
  context = {}
}) => {
  const extension = path.extname(originalname || "");
  const baseName = path.basename(originalname || "upload", extension);
  const safeBaseName = slugify(baseName, { lower: true, strict: true });

  const result = await uploadStream(buffer, {
    folder: safeFolder(folder),
    public_id: safeBaseName ? `${safeBaseName}-${randomUUID().slice(0, 8)}` : undefined,
    resource_type: "auto",
    overwrite: false,
    use_filename: true,
    unique_filename: true,
    tags,
    context,
    type: "upload"
  });

  return normalizeCloudinaryResult(result, mimetype, originalname);
};

export const buildOptimizedImageUrl = (publicId, { width, height, crop = "limit" } = {}) =>
  cloudinary.url(publicId, {
    secure: true,
    resource_type: "image",
    transformation: [
      {
        width,
        height,
        crop,
        quality: "auto",
        fetch_format: "auto",
        dpr: "auto"
      }
    ]
  });

export const buildImageVariants = (publicId) => ({
  optimizedUrl: buildOptimizedImageUrl(publicId, { width: 1280 }),
  thumbnailUrl: buildOptimizedImageUrl(publicId, { width: 480, height: 320, crop: "fill" }),
  blurPlaceholderUrl: cloudinary.url(publicId, {
    secure: true,
    resource_type: "image",
    transformation: [
      {
        width: 32,
        crop: "limit",
        quality: "auto",
        fetch_format: "auto",
        effect: "blur:1000"
      }
    ]
  }),
  srcset: imageWidths.map((width) => ({
    width,
    url: buildOptimizedImageUrl(publicId, { width })
  }))
});

export const deleteCloudinaryAsset = (publicId, resourceType = "image") =>
  cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

export const normalizeCloudinaryResult = (result, mimetype, originalFilename) => {
  const isImage = result.resource_type === "image" || String(mimetype).startsWith("image/");
  const variants = isImage ? buildImageVariants(result.public_id) : {};

  return {
    publicId: result.public_id,
    assetId: result.asset_id,
    originalFilename,
    displayName: result.display_name || result.original_filename || originalFilename,
    folder: result.folder,
    resourceType: result.resource_type,
    format: result.format,
    bytes: result.bytes,
    width: result.width,
    height: result.height,
    secureUrl: result.secure_url,
    ...variants,
    metadata: {
      version: result.version,
      signature: result.signature,
      createdAt: result.created_at
    }
  };
};
