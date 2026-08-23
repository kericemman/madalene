import { Router } from "express";
import { submitBooking } from "../controllers/bookingController.js";

const router = Router();

router.post("/", submitBooking);

export default router;
