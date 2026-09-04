import { Router } from "express";
import {
  getActiveAssessment,
  getAssessmentResultByToken,
  submitAssessment
} from "../controllers/assessmentController.js";
import { assessmentSubmitLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.get("/active", getActiveAssessment);
router.post("/submit", assessmentSubmitLimiter, submitAssessment);
router.get("/results/:token", getAssessmentResultByToken);

export default router;
