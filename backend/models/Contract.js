import mongoose, { Schema } from "mongoose";

const contractSchema = new Schema(
  {
    cropId: { type: Schema.Types.ObjectId, ref: "Crop", required: true },
    farmerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    agreedPrice: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" },
    deliveryDate: { type: String, required: true },
    deliveryLocation: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "negotiating", "active", "completed", "cancelled"],
      default: "pending",
    },
    terms: { type: String, default: null },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

export const Contract = mongoose.model("Contract", contractSchema);
