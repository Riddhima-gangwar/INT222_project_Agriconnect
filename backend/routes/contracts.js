import { Router } from "express";
import { Contract } from "../models/Contract.js";
import { Crop } from "../models/Crop.js";
import { User } from "../models/User.js";
import { requireAuth } from "../services/auth.js";

const router = Router();

async function formatContract(contract) {
  const [crop, farmer, buyer] = await Promise.all([
    Crop.findById(contract.cropId),
    User.findById(contract.farmerId),
    User.findById(contract.buyerId),
  ]);

  return {
    id: contract._id.toString(),
    cropId: contract.cropId.toString(),
    cropTitle: crop?.title ?? "Unknown",
    farmerId: contract.farmerId.toString(),
    farmerName: farmer?.name ?? "Unknown",
    buyerId: contract.buyerId.toString(),
    buyerName: buyer?.name ?? "Unknown",
    quantity: contract.quantity,
    unit: contract.unit,
    agreedPrice: contract.agreedPrice,
    currency: contract.currency,
    deliveryDate: contract.deliveryDate,
    deliveryLocation: contract.deliveryLocation,
    status: contract.status,
    terms: contract.terms ?? null,
    paymentStatus: contract.paymentStatus,
    createdAt: contract.createdAt.toISOString(),
    updatedAt: contract.updatedAt.toISOString(),
  };
}

router.get("/contracts", requireAuth, async (req, res) => {
  const userId = req.user._id;
  const { status, role } = req.query;
  const filter = {};

  if (role === "farmer") {
    filter.farmerId = userId;
  } else if (role === "buyer") {
    filter.buyerId = userId;
  } else {
    filter.$or = [{ farmerId: userId }, { buyerId: userId }];
  }

  if (status) filter.status = status;

  const contracts = await Contract.find(filter).sort({ createdAt: -1 });
  const formatted = await Promise.all(contracts.map(formatContract));
  res.json(formatted);
});

router.post("/contracts", requireAuth, async (req, res) => {
  if (req.user.role !== "buyer") {
    res.status(403).json({ error: "Only buyers can create contracts" });
    return;
  }

  const { cropId, quantity, agreedPrice, currency, deliveryDate, deliveryLocation, terms } = req.body;

  const crop = await Crop.findById(cropId);
  if (!crop) {
    res.status(404).json({ error: "Crop not found" });
    return;
  }

  const contract = await Contract.create({
    cropId,
    quantity,
    agreedPrice,
    currency,
    deliveryDate,
    deliveryLocation,
    terms,
    farmerId: crop.farmerId,
    buyerId: req.user._id,
    unit: crop.unit,
  });

  await Crop.findByIdAndUpdate(crop._id, { $inc: { contractsCount: 1 } });

  res.status(201).json(await formatContract(contract));
});

router.get("/contracts/:id", requireAuth, async (req, res) => {
  const contract = await Contract.findById(req.params.id);
  if (!contract) {
    res.status(404).json({ error: "Contract not found" });
    return;
  }

  const userId = req.user._id.toString();
  if (contract.farmerId.toString() !== userId && contract.buyerId.toString() !== userId) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  res.json(await formatContract(contract));
});

router.patch("/contracts/:id", requireAuth, async (req, res) => {
  const contract = await Contract.findById(req.params.id);
  if (!contract) {
    res.status(404).json({ error: "Contract not found" });
    return;
  }

  const userId = req.user._id.toString();
  if (contract.farmerId.toString() !== userId && contract.buyerId.toString() !== userId) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  const allowed = ["status", "terms", "paymentStatus", "agreedPrice", "deliveryDate", "deliveryLocation"];
  for (const key of allowed) {
    if (req.body[key] != null) contract[key] = req.body[key];
  }
  await contract.save();

  res.json(await formatContract(contract));
});

export default router;
