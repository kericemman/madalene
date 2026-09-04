import multer from "multer";
import { env } from "../config/env.js";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/ogg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
]);

const allowedImageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif"
]);

export const uploadSingleFile = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.maxUploadMb * 1024 * 1024,
    files: 1,
    fields: 8,
    parts: 12
  },
  fileFilter(req, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new Error("This file type is not allowed."));
      return;
    }
    callback(null, true);
  }
}).single("file");

export const uploadSingleImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.maxUploadMb * 1024 * 1024,
    files: 1,
    fields: 16,
    parts: 20
  },
  fileFilter(req, file, callback) {
    if (!allowedImageMimeTypes.has(file.mimetype)) {
      const error = new Error("Please upload a JPG, PNG, WebP, AVIF, or GIF image.");
      error.statusCode = 400;
      callback(error);
      return;
    }
    callback(null, true);
  }
}).single("image");
