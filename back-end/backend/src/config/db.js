import mongoose from "mongoose";
import { env } from "./env.js";

mongoose.set("strictQuery", true);

/** Opens the MongoDB Atlas connection and wires basic lifecycle logging. */
export async function connectDB() {
  mongoose.connection.on("connected", () => {
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    // eslint-disable-next-line no-console
    console.warn("MongoDB disconnected");
  });

  await mongoose.connect(env.mongoUri);
}
