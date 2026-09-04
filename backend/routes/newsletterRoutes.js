import { Router } from "express";
import { subscribeToNewsletter } from "../controllers/newsletterController.js";
import { newsletterSubscribeLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.post("/subscribe", newsletterSubscribeLimiter, subscribeToNewsletter);

export default router;
