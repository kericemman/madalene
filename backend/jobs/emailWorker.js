import { env } from "../config/env.js";
import { processDueEmailJobs } from "../services/emailQueueService.js";

let worker;

export const startEmailWorker = () => {
  if (worker) return worker;

  const run = async () => {
    try {
      await processDueEmailJobs();
    } catch (error) {
      console.error("Email worker failed:", error.message);
    }
  };

  worker = setInterval(run, env.emailWorkerIntervalMs);
  run();
  return worker;
};

export const stopEmailWorker = () => {
  if (worker) {
    clearInterval(worker);
    worker = undefined;
  }
};
