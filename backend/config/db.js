import mongoose from "mongoose";
import { logger } from "../services/logger.js";

let isConnected = false;

export async function connectMongoDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI must be set.");
  }

  await mongoose.connect(uri);
  isConnected = true;
  logger.info("MongoDB connected");
}
