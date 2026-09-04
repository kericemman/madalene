import { Router } from "express";
import { submitApplication } from "../controllers/applicationController.js";
import { publicFormLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.post("/", publicFormLimiter, submitApplication);

export default router;
