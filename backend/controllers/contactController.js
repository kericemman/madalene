import { z } from "zod";
import { env } from "../config/env.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { Lead } from "../models/Lead.js";
import { queueAndAttemptEmail } from "../services/emailQueueService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created } from "../utils/apiResponse.js";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  profession: z.string().max(120).optional(),
  reason: z.string().max(120).optional(),
  message: z.string().min(10).max(5000),
  consent: z.literal(true)
});

const splitName = (name) => {
  const parts = name.trim().split(/\s+/);
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ")
  };
};

export const submitContactMessage = asyncHandler(async (req, res) => {
  const data = contactSchema.parse(req.body);
  const names = splitName(data.name);

  const lead = await Lead.findOneAndUpdate(
    { email: data.email.toLowerCase() },
    {
      $setOnInsert: {
        firstName: names.firstName,
        lastName: names.lastName,
        email: data.email.toLowerCase(),
        profession: data.profession,
        leadSource: "contact_form",
        status: "New"
      },
      $set: {
        lastInteractionAt: new Date()
      }
    },
    { new: true, upsert: true }
  );

  const message = await ContactMessage.create({
    name: data.name,
    email: data.email,
    profession: data.profession,
    reason: data.reason,
    message: data.message,
    consent: data.consent,
    consentAt: new Date(),
    lead: lead._id
  });

  await queueAndAttemptEmail({
    to: data.email,
    name: data.name,
    templateKey: "contact_confirmation",
    variables: data,
    relatedLead: lead._id,
    idempotencyKey: `contact-confirmation:${message._id}`
  });

  if (env.adminNotificationEmail) {
    await queueAndAttemptEmail({
      to: env.adminNotificationEmail,
      name: "Magdalene Wambui",
      templateKey: "admin_contact_notification",
      variables: data,
      relatedLead: lead._id,
      metadata: { contactMessage: message._id },
      idempotencyKey: `contact-admin:${message._id}`
    });
  }

  created(res, "Your message has been received.", { messageId: message._id });
});
