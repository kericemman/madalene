import { env } from "../config/env.js";

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || error.status || 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && env.isProduction ? "Something went wrong." : error.message,
    errors: error.errors || [],
    stack: env.isProduction ? undefined : error.stack
  });
};
