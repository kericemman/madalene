import mongoose from "mongoose";
import { ok } from "../utils/apiResponse.js";

export const healthCheck = (req, res) => {
  ok(res, "API is healthy.", {
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
};
