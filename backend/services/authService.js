import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax",
  path: "/"
};

export const adminPublicProfile = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
  active: admin.active,
  lastLoginAt: admin.lastLoginAt
});

export const signAccessToken = (admin) =>
  jwt.sign(
    {
      sub: String(admin._id),
      email: admin.email,
      name: admin.name,
      role: admin.role
    },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpiresIn }
  );

export const signRefreshToken = (admin) =>
  jwt.sign(
    {
      sub: String(admin._id),
      tokenVersion: admin.refreshTokenVersion || 0
    },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiresIn }
  );

export const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret);

export const setAuthCookies = (res, { accessToken, refreshToken }) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
};

export const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};
