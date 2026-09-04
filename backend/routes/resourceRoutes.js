import { Router } from "express";
import { getRecommendedResource } from "../controllers/resourceController.js";

const router = Router();

router.get("/:slug", getRecommendedResource);

export default router;
