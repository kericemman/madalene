import mongoose from "mongoose";

const EmailSequenceStepSchema = new mongoose.Schema(
  {
    template: { type: mongoose.Schema.Types.ObjectId, ref: "EmailTemplate", required: true },
    delayDays: { type: Number, default: 0, min: 0 },
    delayHours: { type: Number, default: 0, min: 0 },
    delayMinutes: { type: Number, default: 0, min: 0 },
    order: { type: Number, required: true },
    active: { type: Boolean, default: true }
  },
  { _id: true }
);

const EmailSequenceSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    trigger: { type: String, trim: true },
    steps: [EmailSequenceStepSchema],
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

EmailSequenceSchema.index({ key: 1 }, { unique: true });
EmailSequenceSchema.index({ active: 1 });

export const EmailSequence = mongoose.model("EmailSequence", EmailSequenceSchema);
