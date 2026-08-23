import { Router } from "express";
import { listPublicReviews, submitReview } from "../controllers/reviewController.js";

const router = Router();

router.get("/", listPublicReviews);
router.post("/", submitReview);

export default router;
