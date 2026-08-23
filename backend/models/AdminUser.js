import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";

const AdminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "A valid email is required."]
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "content_editor"],
      default: "content_editor"
    },
    active: { type: Boolean, default: true },
    lastLoginAt: Date,
    failedLoginCount: { type: Number, default: 0 },
    lockedUntil: Date,
    refreshTokenVersion: { type: Number, default: 0 }
  },
  { timestamps: true }
);

AdminUserSchema.index({ email: 1 }, { unique: true });
AdminUserSchema.index({ role: 1, active: 1 });

AdminUserSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

AdminUserSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, 12);
};

export const AdminUser = mongoose.model("AdminUser", AdminUserSchema);
