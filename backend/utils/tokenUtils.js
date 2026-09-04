import crypto from "node:crypto";
import { env } from "../config/env.js";

export const createSecureToken = (prefix = "token") => `${prefix}_${crypto.randomBytes(32).toString("hex")}`;

export const legacyHashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

export const hashToken = (token) => {
  if (!env.resultTokenSecret) return legacyHashToken(token);
  return crypto.createHmac("sha256", env.resultTokenSecret).update(token).digest("hex");
};

export const hashTokenCandidates = (token) => [...new Set([hashToken(token), legacyHashToken(token)])];
