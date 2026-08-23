import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, logout, me, refreshSession } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

router.post("/login", loginLimiter, login);
router.post("/refresh", refreshSession);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
