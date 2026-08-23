import { Router } from "express";
import { getPublicOffer, listPublicOffers } from "../controllers/offerController.js";

const router = Router();

router.get("/", listPublicOffers);
router.get("/:slug", getPublicOffer);

export default router;
