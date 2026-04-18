import mongoose, { Schema } from "mongoose";

const cropSchema = new Schema(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    pricePerUnit: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "USD" },
    harvestDate: { type: String, required: true },
    imageUrl: { type: String, default: null },
    isAvailable: { type: Boolean, default: true },
    contractsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Crop = mongoose.model("Crop", cropSchema);
