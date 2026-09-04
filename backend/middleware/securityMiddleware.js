import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import { env } from "../config/env.js";

export const applySecurityMiddleware = (app) => {
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        const error = new Error("Origin is not allowed by CORS.");
        error.statusCode = 403;
        callback(error);
      },
      credentials: true
    })
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      handler(req, res) {
        res.status(429).json({
          success: false,
          message: "Too many requests from this network. Please try again shortly.",
          errors: []
        });
      }
    })
  );
  app.use(mongoSanitize());
  app.use(morgan(env.isProduction ? "combined" : "dev"));
};
