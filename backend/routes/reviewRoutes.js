import { Router } from "express";
import { listPublicReviews, submitReview } from "../controllers/reviewController.js";
import { reviewSubmitLimiter } from "../middleware/rateLimiters.js";
import { uploadSingleImage } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", listPublicReviews);
router.post("/", reviewSubmitLimiter, uploadSingleImage, submitReview);

export default router;
