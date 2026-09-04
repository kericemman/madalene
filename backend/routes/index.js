import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import applicationRoutes from "./applicationRoutes.js";
import authRoutes from "./authRoutes.js";
import assessmentRoutes from "./assessmentRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import codeOfResonanceRoutes from "./codeOfResonanceRoutes.js";
import contactRoutes from "./contactRoutes.js";
import emailRoutes from "./emailRoutes.js";
import healthRoutes from "./healthRoutes.js";
import mediaRoutes from "./mediaRoutes.js";
import newsletterRoutes from "./newsletterRoutes.js";
import offerRoutes from "./offerRoutes.js";
import resourceRoutes from "./resourceRoutes.js";
import reviewRoutes from "./reviewRoutes.js";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/applications", applicationRoutes);
router.use("/auth", authRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/bookings", bookingRoutes);
router.use("/code-of-resonance", codeOfResonanceRoutes);
router.use("/health", healthRoutes);
router.use("/contact", contactRoutes);
router.use("/emails", emailRoutes);
router.use("/media", mediaRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/offers", offerRoutes);
router.use("/resources", resourceRoutes);
router.use("/reviews", reviewRoutes);

export default router;
