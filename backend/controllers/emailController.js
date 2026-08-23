import { z } from "zod";
import { ScheduledEmail } from "../models/ScheduledEmail.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/apiResponse.js";
import { processDueEmailJobs, scheduleEmail } from "../services/emailQueueService.js";

const queueEmailSchema = z.object({
  to: z.string().email(),
  name: z.string().optional(),
  templateKey: z.string().min(2),
  variables: z.record(z.any()).optional(),
  scheduledFor: z.coerce.date().optional(),
  idempotencyKey: z.string().optional(),
  relatedLead: z.string().optional(),
  relatedAssessment: z.string().optional(),
  relatedOffer: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export const queueEmail = asyncHandler(async (req, res) => {
  const data = queueEmailSchema.parse(req.body);
  const email = await scheduleEmail({
    to: data.to,
    name: data.name,
    templateKey: data.templateKey,
    variables: data.variables,
    scheduledFor: data.scheduledFor,
    idempotencyKey: data.idempotencyKey,
    relatedLead: data.relatedLead,
    relatedAssessment: data.relatedAssessment,
    relatedOffer: data.relatedOffer,
    metadata: data.metadata
  });

  created(res, "Email queued successfully.", { email });
});

export const listScheduledEmails = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 25), 1), 100);
  const skip = (page - 1) * limit;
  const query = {};

  if (req.query.status) query.status = req.query.status;
  if (req.query.email) query["recipient.email"] = String(req.query.email).toLowerCase();

  const [items, total] = await Promise.all([
    ScheduledEmail.find(query)
      .sort({ scheduledFor: -1 })
      .skip(skip)
      .limit(limit)
      .populate("template", "key name type subject")
      .lean(),
    ScheduledEmail.countDocuments(query)
  ]);

  ok(res, "Scheduled emails loaded.", {
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

export const processEmailQueue = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.body?.limit || 25), 1), 100);
  const results = await processDueEmailJobs({ limit });
  ok(res, "Email queue processed.", { results });
});
