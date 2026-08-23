import app from "./app.js";
import { configureCloudinary } from "./config/cloudinary.js";
import { assertRequiredEnv, env } from "./config/env.js";
import { connectDatabase } from "./config/db.js";
import { startEmailWorker } from "./jobs/emailWorker.js";

assertRequiredEnv();
configureCloudinary();

const connection = await connectDatabase();

app.listen(env.port, () => {
  console.log(`API listening on port ${env.port}`);
  console.log(`MongoDB connected: ${connection.name}`);
});

if (env.enableEmailWorker) {
  startEmailWorker();
}
