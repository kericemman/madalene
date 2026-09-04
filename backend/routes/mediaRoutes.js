import { Router } from "express";
import {
  deleteMedia,
  getMedia,
  listMedia,
  listPublicMedia,
  uploadMedia
} from "../controllers/mediaController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
import { uploadSingleFile } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/public", listPublicMedia);
router.get("/", ...requireAdmin, listMedia);
router.get("/:id", ...requireAdmin, getMedia);
router.post("/", ...requireAdmin, uploadSingleFile, uploadMedia);
router.delete("/:id", ...requireAdmin, deleteMedia);

export default router;
