import { Router } from "express";
import { listPublicReviews, submitReview } from "../controllers/reviewController.js";
import { uploadSingleImage } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", listPublicReviews);
router.post("/", uploadSingleImage, submitReview);

export default router;
