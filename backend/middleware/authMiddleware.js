import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const requireAuth = (req, res, next) => {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required.", errors: [] });
  }

  try {
    req.user = jwt.verify(token, env.jwtAccessSecret);
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired session.", errors: [] });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: "You do not have permission to do this.", errors: [] });
  }
  next();
};

export const requireAdmin = [requireAuth, requireRole("admin", "content_editor")];
