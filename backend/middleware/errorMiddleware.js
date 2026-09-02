import { env } from "../config/env.js";

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || error.status || 500;

  // Log the real error on the server
  console.error("=================================");
  console.error("BACKEND ERROR");
  console.error("Method:", req.method);
  console.error("Route:", req.originalUrl);
  console.error("Status:", statusCode);
  console.error("Message:", error.message);
  console.error("Stack:", error.stack);
  console.error("=================================");

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500 && env.isProduction
        ? "Something went wrong."
        : error.message,
    errors: error.errors || [],
    stack: env.isProduction ? undefined : error.stack
  });
};