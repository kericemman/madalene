import { z } from "zod";
import { Application } from "../models/Application.js";
import { Lead } from "../models/Lead.js";
import { Offer } from "../models/Offer.js";
import { queueAndAttemptEmail } from "../services/emailQueueService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/apiResponse.js";

const applicationSchema = z.object({
  offerSlug: z.string().min(2).max(180),
  firstName: z.string().min(1).max(80),
  lastName: z.string().max(80).optional(),
  email: z.string().email(),
  phone: z.string().max(80).optional(),
  profession: z.string().max(120).optional(),
  industry: z.string().max(120).optional(),
  businessStage: z.string().max(120).optional(),
  website: z.string().max(240).optional(),
  linkedInProfile: z.string().max(240).optional(),
  country: z.string().max(120).optional(),
  primaryChallenge: z.string().max(700).optional(),
  desiredOutcome: z.string().max(700).optional(),
  readinessToInvest: z.string().max(120).optional(),
  whyNow: z.string().max(1200).optional(),
  supportNeeded: z.string().max(1200).optional(),
  message: z.string().max(2000).optional(),
  source: z.string().max(120).optional(),
  idempotencyKey: z.string().max(120).optional(),
  consent: z.literal(true),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      term: z.string().optional(),
      content: z.string().optional()
    })
    .optional()
});

const compactName = (payload) =>
  [payload.firstName, payload.lastName].filter(Boolean).join(" ") || payload.email;

const offerSnapshot = (offer) => ({
  name: offer.name,
  slug: offer.slug,
  offerType: offer.offerType
});

export const submitApplication = asyncHandler(async (req, res) => {
  const payload = applicationSchema.parse(req.body);

  if (payload.idempotencyKey) {
    const existing = await Application.findOne({ idempotencyKey: payload.idempotencyKey }).lean();
    if (existing) {
      return ok(res, "Application was already submitted.", {
        applicationId: existing._id,
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
  const lead = await Lead.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        email,
        leadSource: payload.source || "offer_application"
      },
      $set: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        profession: payload.profession,
        industry: payload.industry,
        businessStage: payload.businessStage,
        website: payload.website,
        linkedInProfile: payload.linkedInProfile,
        country: payload.country,
        primaryChallenge: payload.primaryChallenge,
        desiredOutcome: payload.desiredOutcome,
        readinessToInvest: payload.readinessToInvest,
        recommendedOffer: offer._id,
        status: "Applied",
        lastInteractionAt: now,
        utm: payload.utm
      },
      $addToSet: {
        tags: { $each: ["application-submitted", `offer:${offer.slug}`] }
      }
    },
    { new: true, upsert: true }
  );

  const application = await Application.create({
    ...payload,
    email,
    lead: lead._id,
    offer: offer._id,
    offerSnapshot: offerSnapshot(offer),
    consentAt: now,
    submittedAt: now
  });

  await queueAndAttemptEmail({
    to: email,
    name: compactName(payload),
    templateKey: "application_received",
    relatedLead: lead._id,
    relatedOffer: offer._id,
    idempotencyKey: `application-received:${application._id}`,
    variables: {
      firstName: payload.firstName,
      offerName: offer.name,
      nextStep: "I will review your application and follow up with the next appropriate step."
    },
    metadata: {
      application: application._id,
      offerSlug: offer.slug
    }
  });

  created(res, "Application received.", {
    applicationId: application._id,
    leadId: lead._id
  });
});
