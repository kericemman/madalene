import { Router } from "express";
import { submitApplication } from "../controllers/applicationController.js";

const router = Router();

router.post("/", submitApplication);

export default router;
