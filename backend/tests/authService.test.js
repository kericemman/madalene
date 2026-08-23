import { describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { adminPublicProfile, signAccessToken, signRefreshToken } from "../services/authService.js";

const admin = {
  _id: "507f1f77bcf86cd799439011",
  name: "Magdalene Wambui",
  email: "admin@example.com",
  role: "admin",
  active: true,
  refreshTokenVersion: 2,
  lastLoginAt: new Date("2026-07-16T00:00:00.000Z")
};

describe("authService", () => {
  it("signs access tokens with admin identity and role", () => {
    const token = signAccessToken(admin);
    const decoded = jwt.verify(token, env.jwtAccessSecret);

    expect(decoded.sub).toBe(String(admin._id));
    expect(decoded.email).toBe(admin.email);
    expect(decoded.role).toBe("admin");
  });

  it("signs refresh tokens with token version", () => {
    const token = signRefreshToken(admin);
    const decoded = jwt.verify(token, env.jwtRefreshSecret);

    expect(decoded.sub).toBe(String(admin._id));
    expect(decoded.tokenVersion).toBe(2);
  });

  it("returns only public admin profile fields", () => {
    const profile = adminPublicProfile({ ...admin, passwordHash: "secret" });

    expect(profile.passwordHash).toBeUndefined();
    expect(profile.email).toBe(admin.email);
    expect(profile.role).toBe("admin");
  });
});
