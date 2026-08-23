import express from "express";
import { applySecurityMiddleware } from "./middleware/securityMiddleware.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import routes from "./routes/index.js";

const app = express();

applySecurityMiddleware(app);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
