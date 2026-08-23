import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

export const configureCloudinary = () => {
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    return false;
  }

  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true
  });

  return true;
};

export { cloudinary };
