import { Router } from "express";
import {
  listScheduledEmails,
  processEmailQueue,
  queueEmail
} from "../controllers/emailController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", ...requireAdmin, listScheduledEmails);
router.post("/queue", ...requireAdmin, queueEmail);
router.post("/process", ...requireAdmin, processEmailQueue);

export default router;
