import { Router } from "express";
import {
  getPublicCodeOfResonanceEntry,
  listPublicCodeOfResonanceEntries
} from "../controllers/codeOfResonanceController.js";

const router = Router();

router.get("/", listPublicCodeOfResonanceEntries);
router.get("/:slug", getPublicCodeOfResonanceEntry);

export default router;
