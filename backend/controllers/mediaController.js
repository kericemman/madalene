import { z } from "zod";
import { MediaAsset } from "../models/MediaAsset.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/apiResponse.js";
import {
  deleteCloudinaryAsset,
  uploadBufferToCloudinary
} from "../services/cloudinaryService.js";

const uploadSchema = z.object({
  folder: z.string().max(100).optional(),
  altText: z.string().max(180).optional(),
  tags: z
    .string()
    .optional()
    .transform((value) =>
      String(value || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    ),
  usage: z.string().max(80).optional(),
  relatedModel: z.string().max(80).optional()
});

const publicMediaUsages = ["about-brand", "about-event", "home-hero", "home-problem", "earned-credibility-hero"];
const publicResourceTypes = ["image", "video"];

const parseListParam = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(422).json({
      success: false,
      message: "Please attach a file.",
      errors: []
    });
  }

  const parsed = uploadSchema.parse(req.body);

  const uploaded = await uploadBufferToCloudinary({
    buffer: req.file.buffer,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    folder: parsed.folder,
    tags: parsed.tags,
    context: {
      alt: parsed.altText || "",
      usage: parsed.usage || ""
    }
  });

  const media = await MediaAsset.create({
    ...uploaded,
    altText: parsed.altText,
    tags: parsed.tags,
    context: {
      usage: parsed.usage,
      relatedModel: parsed.relatedModel
    },
    uploadedBy: req.user?.sub
  });

  created(res, "Media uploaded and optimized successfully.", { media });
});

export const listMedia = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 24), 1), 100);
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.resourceType) query.resourceType = req.query.resourceType;
  if (req.query.tag) query.tags = req.query.tag;
  if (req.query.usage) {
    const usages = parseListParam(req.query.usage);
    if (usages.length === 1) query["context.usage"] = usages[0];
    if (usages.length > 1) query["context.usage"] = { $in: usages };
  }

  const [items, total] = await Promise.all([
    MediaAsset.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    MediaAsset.countDocuments(query)
  ]);

  ok(res, "Media assets loaded.", {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const listPublicMedia = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 24), 1), 60);
  const skip = (page - 1) * limit;
  const requestedUsages = parseListParam(req.query.usage).filter((usage) => publicMediaUsages.includes(usage));
  const requestedResourceType = publicResourceTypes.includes(req.query.resourceType) ? req.query.resourceType : "image";
  const search = String(req.query.name || req.query.q || "").trim().slice(0, 80);

  const query = {
    resourceType: requestedResourceType,
    "context.usage": requestedUsages.length ? { $in: requestedUsages } : { $in: publicMediaUsages }
  };
  if (req.query.tag) query.tags = req.query.tag;
  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    query.$or = [{ displayName: searchRegex }, { originalFilename: searchRegex }, { altText: searchRegex }];
  }

  const [items, total] = await Promise.all([
    MediaAsset.find(query).sort({ "metadata.displayOrder": 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    MediaAsset.countDocuments(query)
  ]);

  ok(res, "Public media assets loaded.", {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getMedia = asyncHandler(async (req, res) => {
  const media = await MediaAsset.findById(req.params.id).lean();
  if (!media) {
    return res.status(404).json({ success: false, message: "Media asset not found.", errors: [] });
  }

  ok(res, "Media asset loaded.", { media });
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await MediaAsset.findById(req.params.id);
  if (!media) {
    return res.status(404).json({ success: false, message: "Media asset not found.", errors: [] });
  }

  await deleteCloudinaryAsset(media.publicId, media.resourceType);
  await media.deleteOne();

  ok(res, "Media asset deleted.", { id: req.params.id });
});
