import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import productRouter from "./routes/productRoutes.js";
import authRouter from "./routes/authRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import productRequestRouter from "./routes/productRequestRoutes.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

// Broad API-wide limiter; tighter limits are added per-route (e.g. admin
// login) in the Admin Dashboard milestone.
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/products", productRouter);
app.use("/api/admin", authRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/orders", orderRouter);
app.use("/api/product-requests", productRequestRouter);

app.use(notFound);
app.use(errorHandler);
