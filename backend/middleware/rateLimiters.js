import rateLimit from "express-rate-limit";

const createJsonLimiter = ({ windowMs, limit, message }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler(req, res) {
      res.status(429).json({
        success: false,
        message,
        errors: []
      });
    }
  });

export const publicFormLimiter = createJsonLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: "Too many submissions from this network. Please wait a few minutes and try again."
});

export const assessmentSubmitLimiter = createJsonLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 12,
  message: "Too many assessment submissions from this network. Please wait before trying again."
});

export const newsletterSubscribeLimiter = createJsonLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many subscription attempts from this network. Please wait a few minutes and try again."
});

export const authRefreshLimiter = createJsonLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  message: "Too many session refresh attempts from this network. Please wait a few minutes and try again."
});

export const reviewSubmitLimiter = createJsonLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 8,
  message: "Too many testimonial submissions from this network. Please wait before trying again."
});
