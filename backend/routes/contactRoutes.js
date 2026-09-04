import { Router } from "express";
import { submitContactMessage } from "../controllers/contactController.js";
import { publicFormLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.post("/", publicFormLimiter, submitContactMessage);

export default router;
