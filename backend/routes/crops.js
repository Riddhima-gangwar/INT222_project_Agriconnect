import { Router } from "express";
import mongoose from "mongoose";
import { Crop } from "../models/Crop.js";
import { User } from "../models/User.js";
import { requireAuth } from "../services/auth.js";

const router = Router();

function formatCrop(crop, farmer) {
  return {
    id: crop._id.toString(),
    farmerId: crop.farmerId.toString(),
    farmerName: farmer?.name ?? "Unknown",
    farmerLocation: farmer?.location ?? null,
    title: crop.title,
    description: crop.description,
    category: crop.category,
    quantity: crop.quantity,
    unit: crop.unit,
    pricePerUnit: crop.pricePerUnit,
    currency: crop.currency,
    harvestDate: crop.harvestDate,
    imageUrl: crop.imageUrl ?? null,
    isAvailable: crop.isAvailable,
    contractsCount: crop.contractsCount,
    createdAt: crop.createdAt.toISOString(),
  };
}

router.get("/crops", async (req, res) => {
  const { category, minPrice, maxPrice, search, farmerId } = req.query;
  const filter = { isAvailable: true };

  if (category) filter.category = category;
  if (farmerId) filter.farmerId = new mongoose.Types.ObjectId(farmerId);
  if (minPrice != null || maxPrice != null) {
    filter.pricePerUnit = {};
    if (minPrice != null) filter.pricePerUnit.$gte = Number(minPrice);
    if (maxPrice != null) filter.pricePerUnit.$lte = Number(maxPrice);
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  const crops = await Crop.find(filter).sort({ createdAt: -1 });
  const farmerIds = [...new Set(crops.map((c) => c.farmerId.toString()))];
  const farmers = await User.find({ _id: { $in: farmerIds } });
  const farmerMap = new Map(farmers.map((f) => [f._id.toString(), f]));

  res.json(crops.map((c) => formatCrop(c, farmerMap.get(c.farmerId.toString()))));
});

router.post("/crops", requireAuth, async (req, res) => {
  if (req.user.role !== "farmer") {
    res.status(403).json({ error: "Only farmers can create crop listings" });
    return;
  }

  const { title, description, category, quantity, unit, pricePerUnit, currency, harvestDate, imageUrl } = req.body;
  const crop = await Crop.create({ title, description, category, quantity, unit, pricePerUnit, currency, harvestDate, imageUrl, farmerId: req.user._id });
  res.status(201).json(formatCrop(crop, req.user));
});

router.get("/crops/:id", async (req, res) => {
  const crop = await Crop.findById(req.params.id);
  if (!crop) {
    res.status(404).json({ error: "Crop not found" });
    return;
  }

  const farmer = await User.findById(crop.farmerId);
  res.json(formatCrop(crop, farmer));
});

router.patch("/crops/:id", requireAuth, async (req, res) => {
  const crop = await Crop.findById(req.params.id);
  if (!crop) {
    res.status(404).json({ error: "Crop not found" });
    return;
  }

  if (crop.farmerId.toString() !== req.user._id.toString()) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  const allowed = ["title", "description", "category", "quantity", "unit", "pricePerUnit", "currency", "harvestDate", "imageUrl", "isAvailable"];
  for (const key of allowed) {
    if (req.body[key] != null) crop[key] = req.body[key];
  }
  await crop.save();

  const farmer = await User.findById(crop.farmerId);
  res.json(formatCrop(crop, farmer));
});

router.delete("/crops/:id", requireAuth, async (req, res) => {
  const crop = await Crop.findById(req.params.id);
  if (!crop) {
    res.status(404).json({ error: "Crop not found" });
    return;
  }

  if (crop.farmerId.toString() !== req.user._id.toString()) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  await crop.deleteOne();
  res.sendStatus(204);
});

export default router;
