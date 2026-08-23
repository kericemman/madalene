import { Router } from "express";
import {
  getActiveAssessment,
  getAssessmentResultByToken,
  submitAssessment
} from "../controllers/assessmentController.js";

const router = Router();

router.get("/active", getActiveAssessment);
router.post("/submit", submitAssessment);
router.get("/results/:token", getAssessmentResultByToken);

export default router;
