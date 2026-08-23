import dotenv from "dotenv";

dotenv.config();

const list = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const localFrontendOrigins = [5173, 5174, 5175, 5176, 5177, 5178, 5179].map(
  (port) => `http://localhost:${port}`
);
const configuredCorsOrigins = list(process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "http://localhost:5173");
const corsOrigins =
  process.env.NODE_ENV === "production"
    ? configuredCorsOrigins
    : [...new Set([...configuredCorsOrigins, ...localFrontendOrigins])];

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/earned-credibility",
  jwtAccessSecret:
    process.env.JWT_ACCESS_SECRET ||
    (process.env.NODE_ENV === "production" ? "" : "dev-only-access-secret-change-me"),
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET ||
    (process.env.NODE_ENV === "production" ? "" : "dev-only-refresh-secret-change-me"),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  adminUrl: process.env.ADMIN_URL || "http://localhost:5173/admin",
  corsOrigins,
  resendApiKey: process.env.RESEND_API_KEY || "",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "",
  enableAiAssessmentAnalysis: process.env.OPENAI_ASSESSMENT_ANALYSIS_ENABLED === "true",
  aiAssessmentMinimumConfidence: Number(process.env.OPENAI_ASSESSMENT_MIN_CONFIDENCE || 0.65),
  emailFrom: process.env.EMAIL_FROM || "Magdalene Wambui <hello@example.com>",
  emailLogoUrl: process.env.EMAIL_LOGO_URL || "",
  adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || "",
  oneToOneBookingUrl:
    process.env.ONE_TO_ONE_BOOKING_URL ||
    "https://calendly.com/wambui-magdalene/content-that-connects",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    defaultFolder: process.env.CLOUDINARY_DEFAULT_FOLDER || "earned-credibility"
  },
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 10),
  appUrl: process.env.APP_URL || process.env.FRONTEND_URL || "http://localhost:5173",
  apiUrl: process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api`,
  resultTokenSecret: process.env.RESULT_TOKEN_SECRET || "",
  cronSecret: process.env.CRON_SECRET || "",
  // Email automation is part of the application flow. It is enabled unless a deployment explicitly pauses it.
  enableEmailWorker: process.env.ENABLE_EMAIL_WORKER !== "false",
  emailWorkerIntervalMs: Number(process.env.EMAIL_WORKER_INTERVAL_MS || 60000)
};

export const assertRequiredEnv = () => {
  if (!env.isProduction) return;

  const required = [
    ["MONGODB_URI", env.mongoUri],
    ["JWT_ACCESS_SECRET", env.jwtAccessSecret],
    ["JWT_REFRESH_SECRET", env.jwtRefreshSecret],
    ["RESEND_API_KEY", env.resendApiKey],
    ["EMAIL_FROM", env.emailFrom],
    ["CLOUDINARY_CLOUD_NAME", env.cloudinary.cloudName],
    ["CLOUDINARY_API_KEY", env.cloudinary.apiKey],
    ["CLOUDINARY_API_SECRET", env.cloudinary.apiSecret],
    ["RESULT_TOKEN_SECRET", env.resultTokenSecret]
  ];

  const missing = required.filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) {
    throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  }
};
