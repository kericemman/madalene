import { z } from "zod";
import { Lead } from "../models/Lead.js";
import { queueAndAttemptEmail, scheduleEmailSequence } from "../services/emailQueueService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/apiResponse.js";

const subscriptionSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().email(),
  source: z.string().trim().max(80).optional(),
  consentVersion: z.string().trim().max(40).optional()
});

const splitName = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ")
  };
};

export const subscribeToNewsletter = asyncHandler(async (req, res) => {
  const data = subscriptionSchema.parse(req.body);
  const email = data.email.toLowerCase();
  const names = splitName(data.name);
  const now = new Date();

  const lead = await Lead.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        email,
        leadSource: data.source || "code_of_resonance_subscription",
        status: "Nurturing"
      },
      $set: {
        ...(names.firstName ? { firstName: names.firstName } : {}),
        ...(names.lastName ? { lastName: names.lastName } : {}),
        newsletterConsent: true,
        marketingConsentAt: now,
        consentVersion: data.consentVersion || "2026-07",
        lastInteractionAt: now,
        "communicationPreferences.marketing": true
      },
      $addToSet: {
        tags: "code-of-resonance-subscriber"
      },
      $unset: {
        unsubscribedAt: ""
      }
    },
    { new: true, upsert: true }
  );

  const emailName = data.name || names.firstName || email;
  const firstName = lead.firstName || names.firstName || "there";

  const confirmation = await queueAndAttemptEmail({
    to: email,
    name: emailName,
    templateKey: "newsletter_welcome",
    relatedLead: lead._id,
    idempotencyKey: `newsletter-welcome:${lead._id}`,
    variables: {
      firstName,
      subscriptionName: "The Code of Resonance"
    },
    metadata: {
      source: data.source || "code_of_resonance_subscription",
      purpose: "subscription_confirmation"
    }
  });

  const sequenceJobs = await scheduleEmailSequence({
    sequenceKey: "code_of_resonance_5_day",
    to: email,
    name: emailName,
    relatedLead: lead._id,
    variables: {
      firstName,
      subscriptionName: "The Code of Resonance"
    },
    metadata: {
      source: data.source || "code_of_resonance_subscription"
    }
  });

  ok(res, "You are subscribed to The Code of Resonance.", {
    leadId: lead._id,
    confirmationEmailId: confirmation.email._id,
    confirmationDelivery: confirmation.delivery.status,
    scheduledEmails: sequenceJobs.length + 1
  });
});
