import { EmailSequence } from "../models/EmailSequence.js";
import { EmailTemplate } from "../models/EmailTemplate.js";
import { ScheduledEmail } from "../models/ScheduledEmail.js";
import { defaultEmailTemplateMap } from "../templates/defaultEmailTemplates.js";
import { renderTemplate } from "./emailTemplateRenderer.js";
import { sendTransactionalEmail } from "./emailService.js";

const findTemplate = async (templateKey, templateId) => {
  const defaultTemplate = defaultEmailTemplateMap.get(templateKey);

  if (templateId) {
    const template = await EmailTemplate.findById(templateId).lean();
    if (template) return template;
  }

  const template = await EmailTemplate.findOne({ key: templateKey, active: true }).lean();
  if (
    template &&
    defaultTemplate &&
    Number(defaultTemplate.version || 1) > Number(template.version || 1)
  ) {
    return defaultTemplate;
  }

  return template || defaultTemplate;
};

export const scheduleEmail = async ({
  to,
  name,
  templateKey,
  template,
  variables = {},
  scheduledFor = new Date(),
  idempotencyKey,
  relatedLead,
  relatedAssessment,
  relatedOffer,
  metadata = {}
}) => {
  if (idempotencyKey) {
    const existing = await ScheduledEmail.findOne({ idempotencyKey });
    if (existing) return existing;
  }

  return ScheduledEmail.create({
    recipient: { email: to, name },
    template,
    templateKey,
    variables,
    scheduledFor,
    idempotencyKey,
    relatedLead,
    relatedAssessment,
    relatedOffer,
    metadata
  });
};

export const queueAndAttemptEmail = async (params) => {
  const email = await scheduleEmail(params);
  const scheduledFor = new Date(email.scheduledFor).getTime();

  if (Number.isNaN(scheduledFor) || scheduledFor > Date.now()) {
    return {
      email,
      delivery: { status: "scheduled" }
    };
  }

  try {
    const delivered = (await processScheduledEmail(email._id)) || email;
    return {
      email: delivered,
      delivery: { status: delivered.status === "sent" ? "sent" : "queued" }
    };
  } catch (error) {
    const latest = (await ScheduledEmail.findById(email._id)) || email;
    return {
      email: latest,
      delivery: { status: latest.status === "failed" ? "failed" : "queued", error: error.message }
    };
  }
};

export const processScheduledEmail = async (jobId) => {
  const lockedJob = await ScheduledEmail.findOneAndUpdate(
    { _id: jobId, status: "pending" },
    { status: "processing", $inc: { attemptCount: 1 } },
    { new: true }
  );

  if (!lockedJob) return null;

  try {
    const template = await findTemplate(lockedJob.templateKey, lockedJob.template);
    if (!template) {
      throw new Error(`Email template not found: ${lockedJob.templateKey}`);
    }

    const rendered = renderTemplate(template, lockedJob.variables);
    const result = await sendTransactionalEmail({
      to: lockedJob.recipient.email,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      tags: [
        { name: "template", value: lockedJob.templateKey || template.key },
        { name: "scheduled_email", value: String(lockedJob._id) }
      ]
    });

    lockedJob.status = "sent";
    lockedJob.sentAt = new Date();
    lockedJob.providerMessageId = result.id;
    lockedJob.subjectSnapshot = rendered.subject;
    lockedJob.htmlSnapshot = rendered.html;
    lockedJob.textSnapshot = rendered.text;
    lockedJob.lastError = undefined;
    await lockedJob.save();

    return lockedJob;
  } catch (error) {
    lockedJob.status = lockedJob.attemptCount >= lockedJob.maxAttempts ? "failed" : "pending";
    lockedJob.lastError = error.message;
    await lockedJob.save();
    throw error;
  }
};

export const processDueEmailJobs = async ({ limit = 25 } = {}) => {
  const jobs = await ScheduledEmail.find({
    status: "pending",
    scheduledFor: { $lte: new Date() },
    $expr: { $lt: ["$attemptCount", "$maxAttempts"] }
  })
    .sort({ scheduledFor: 1 })
    .limit(limit)
    .select("_id")
    .lean();

  const results = [];

  for (const job of jobs) {
    try {
      const sent = await processScheduledEmail(job._id);
      if (sent) results.push({ id: job._id, status: "sent" });
    } catch (error) {
      results.push({ id: job._id, status: "failed", error: error.message });
    }
  }

  return results;
};

export const scheduleEmailSequence = async ({
  sequenceKey,
  to,
  name,
  relatedLead,
  variables = {},
  metadata = {}
}) => {
  const sequence = await EmailSequence.findOne({ key: sequenceKey, active: true })
    .populate("steps.template")
    .lean();

  if (!sequence) return [];

  const now = Date.now();
  const activeSteps = (sequence.steps || [])
    .filter((step) => step.active && step.template?.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const scheduled = [];
  for (const step of activeSteps) {
    const delayMs =
      Number(step.delayDays || 0) * 24 * 60 * 60 * 1000 +
      Number(step.delayHours || 0) * 60 * 60 * 1000 +
      Number(step.delayMinutes || 0) * 60 * 1000;
    const email = await scheduleEmail({
      to,
      name,
      template: step.template._id,
      templateKey: step.template.key,
      scheduledFor: new Date(now + delayMs),
      relatedLead,
      variables,
      metadata: {
        ...metadata,
        sequenceKey,
        sequenceStep: step.order
      },
      idempotencyKey: `${sequenceKey}:${relatedLead || to}:day-${step.order}`
    });
    scheduled.push(email);
  }

  return scheduled;
};
