import { z } from "zod";
import { Booking } from "../models/Booking.js";
import { Lead } from "../models/Lead.js";
import { Offer } from "../models/Offer.js";
import { queueAndAttemptEmail } from "../services/emailQueueService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/apiResponse.js";

const bookingSchema = z.object({
  offerSlug: z.string().min(2).max(180),
  firstName: z.string().min(1).max(80),
  lastName: z.string().max(80).optional(),
  email: z.string().email(),
  phone: z.string().max(80).optional(),
  scheduledFor: z.coerce.date().optional(),
  timezone: z.string().max(80).optional(),
  meetingUrl: z.string().max(500).optional(),
  externalBookingUrl: z.string().max(500).optional(),
  message: z.string().max(1600).optional(),
  source: z.string().max(120).optional(),
  idempotencyKey: z.string().max(120).optional(),
  consent: z.literal(true)
});

const formatStartsAt = (value, timezone) => {
  if (!value) return "the selected time";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone || "UTC"
  }).format(new Date(value));
};

const compactName = (payload) =>
  [payload.firstName, payload.lastName].filter(Boolean).join(" ") || payload.email;

const offerSnapshot = (offer) => ({
  name: offer.name,
  slug: offer.slug,
  offerType: offer.offerType
});

export const submitBooking = asyncHandler(async (req, res) => {
  const payload = bookingSchema.parse(req.body);

  if (payload.idempotencyKey) {
    const existing = await Booking.findOne({ idempotencyKey: payload.idempotencyKey }).lean();
    if (existing) {
      return ok(res, "Booking was already submitted.", {
        bookingId: existing._id,
        alreadySubmitted: true
      });
    }
  }

  const offer = await Offer.findOne({ slug: payload.offerSlug, active: true });
  if (!offer) {
    return res.status(404).json({
      success: false,
      message: "The selected offer is not available.",
      errors: []
    });
  }

  const email = payload.email.toLowerCase();
  const now = new Date();
  const status = payload.scheduledFor ? "scheduled" : "requested";
  const lead = await Lead.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        email,
        leadSource: payload.source || "booking"
      },
      $set: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        recommendedOffer: offer._id,
        status: "Session Booked",
        lastInteractionAt: now
      },
      $addToSet: {
        tags: { $each: ["booking", `offer:${offer.slug}`] }
      }
    },
    { new: true, upsert: true }
  );

  const booking = await Booking.create({
    ...payload,
    email,
    lead: lead._id,
    offer: offer._id,
    offerSnapshot: offerSnapshot(offer),
    sessionName: offer.name,
    status,
    consentAt: now,
    submittedAt: now
  });

  await queueAndAttemptEmail({
    to: email,
    name: compactName(payload),
    templateKey: "booking_confirmation",
    relatedLead: lead._id,
    relatedOffer: offer._id,
    idempotencyKey: `booking-confirmation:${booking._id}`,
    variables: {
      firstName: payload.firstName,
      sessionName: offer.name,
      startsAt: formatStartsAt(payload.scheduledFor, payload.timezone),
      meetingUrl: payload.meetingUrl || payload.externalBookingUrl || "#"
    },
    metadata: {
      booking: booking._id,
      offerSlug: offer.slug
    }
  });

  created(res, "Booking received.", {
    bookingId: booking._id,
    leadId: lead._id,
    status
  });
});
