import { connectDatabase } from "../config/db.js";
import { configureCloudinary } from "../config/cloudinary.js";
import { EmailSequence } from "../models/EmailSequence.js";
import { EmailTemplate } from "../models/EmailTemplate.js";
import { codeOfResonanceSequence, defaultEmailTemplates } from "../templates/defaultEmailTemplates.js";

configureCloudinary();
await connectDatabase();

for (const template of defaultEmailTemplates) {
  const templateVersion = Number(template.version || 1);
  const templateData = {
    key: template.key,
    name: template.name,
    type: template.type,
    subject: template.subject,
    preheader: template.preheader,
    html: template.html.trim(),
    text: template.text,
    variables: template.variables,
    active: true,
    editable: true,
    version: templateVersion
  };
  const existing = await EmailTemplate.findOne({ key: template.key }).select("version").lean();

  await EmailTemplate.findOneAndUpdate(
    { key: template.key },
    existing && Number(existing.version || 1) >= templateVersion
      ? { $setOnInsert: templateData }
      : { $set: templateData },
    { upsert: true, new: true }
  );
}

const sequenceSteps = [];
for (const step of codeOfResonanceSequence.steps) {
  const template = await EmailTemplate.findOne({ key: step.templateKey }).select("_id").lean();
  if (template) {
    sequenceSteps.push({
      template: template._id,
      delayDays: step.delayDays,
      delayHours: step.delayHours || 0,
      delayMinutes: step.delayMinutes || 0,
      order: step.order,
      active: true
    });
  }
}

await EmailSequence.findOneAndUpdate(
  { key: codeOfResonanceSequence.key },
  {
    key: codeOfResonanceSequence.key,
    name: codeOfResonanceSequence.name,
    description: codeOfResonanceSequence.description,
    trigger: codeOfResonanceSequence.trigger,
    steps: sequenceSteps,
    active: true
  },
  { upsert: true, new: true }
);

console.log(`Seeded ${defaultEmailTemplates.length} email templates and ${sequenceSteps.length} sequence steps.`);
process.exit(0);
