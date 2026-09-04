import { Router } from "express";
import { submitBooking } from "../controllers/bookingController.js";
import { publicFormLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.post("/", publicFormLimiter, submitBooking);

export default router;
