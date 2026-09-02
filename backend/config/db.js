import mongoose from "mongoose";
import { env } from "./env.js";

const uriIncludesDatabaseName = (uri) => {
  try {
    const parsed = new URL(uri);
    return Boolean(parsed.pathname && parsed.pathname !== "/");
  } catch {
    return true;
  }
};

export const connectDatabase = async () => {
  mongoose.set("strictQuery", true);

  const options = uriIncludesDatabaseName(env.mongoUri)
    ? {}
    : { dbName: env.mongoDbName };

  await mongoose.connect(env.mongoUri, options);

  return mongoose.connection;
};
