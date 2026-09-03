import { env } from "../config/env.js";

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  const isMulterError = error.name === "MulterError";
  const isZodError = error.name === "ZodError" && Array.isArray(error.issues);
  const statusCode = error.statusCode || error.status || (isMulterError ? 400 : isZodError ? 422 : 500);
  const message =
    isZodError
      ? "Please check the form fields and try again."
      : isMulterError && error.code === "LIMIT_FILE_SIZE"
        ? "Uploaded file is too large."
        : error.message;
  const errors = isZodError
    ? error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    : error.errors || [];

  // Log the real error on the server
  console.error("=================================");
  console.error("BACKEND ERROR");
  console.error("Method:", req.method);
  console.error("Route:", req.originalUrl);
  console.error("Status:", statusCode);
  console.error("Message:", message);
  console.error("Stack:", error.stack);
  console.error("=================================");

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500 && env.isProduction
        ? "Something went wrong."
        : message,
    errors,
    stack: env.isProduction ? undefined : error.stack
  });
};
