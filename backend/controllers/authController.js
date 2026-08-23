import { z } from "zod";
import { AdminUser } from "../models/AdminUser.js";
import {
  adminPublicProfile,
  clearAuthCookies,
  setAuthCookies,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/apiResponse.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const lockMinutes = 15;
const maxFailedAttempts = 5;

export const login = asyncHandler(async (req, res) => {
  const payload = loginSchema.parse(req.body);
  const admin = await AdminUser.findOne({ email: payload.email.toLowerCase() }).select("+passwordHash");

  if (!admin || !admin.active) {
    return res.status(401).json({ success: false, message: "Invalid email or password.", errors: [] });
  }

  if (admin.lockedUntil && admin.lockedUntil > new Date()) {
    return res.status(423).json({
      success: false,
      message: "This account is temporarily locked. Please try again later.",
      errors: []
    });
  }

  const passwordMatches = await admin.comparePassword(payload.password);
  if (!passwordMatches) {
    admin.failedLoginCount += 1;
    if (admin.failedLoginCount >= maxFailedAttempts) {
      admin.lockedUntil = new Date(Date.now() + lockMinutes * 60 * 1000);
    }
    await admin.save();
    return res.status(401).json({ success: false, message: "Invalid email or password.", errors: [] });
  }

  admin.failedLoginCount = 0;
  admin.lockedUntil = undefined;
  admin.lastLoginAt = new Date();
  await admin.save();

  const accessToken = signAccessToken(admin);
  const refreshToken = signRefreshToken(admin);
  setAuthCookies(res, { accessToken, refreshToken });

  ok(res, "Logged in successfully.", {
    admin: adminPublicProfile(admin),
    accessToken
  });
});

export const refreshSession = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) {
    return res.status(401).json({ success: false, message: "Refresh token is required.", errors: [] });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired refresh token.", errors: [] });
  }

  const admin = await AdminUser.findById(decoded.sub);
  if (!admin || !admin.active || admin.refreshTokenVersion !== decoded.tokenVersion) {
    return res.status(401).json({ success: false, message: "Invalid or expired refresh token.", errors: [] });
  }

  const accessToken = signAccessToken(admin);
  const refreshToken = signRefreshToken(admin);
  setAuthCookies(res, { accessToken, refreshToken });

  ok(res, "Session refreshed.", {
    admin: adminPublicProfile(admin),
    accessToken
  });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookies(res);
  ok(res, "Logged out successfully.");
});

export const me = asyncHandler(async (req, res) => {
  const admin = await AdminUser.findById(req.user.sub);
  if (!admin || !admin.active) {
    return res.status(401).json({ success: false, message: "Invalid or expired session.", errors: [] });
  }

  ok(res, "Current admin loaded.", {
    admin: adminPublicProfile(admin)
  });
});
