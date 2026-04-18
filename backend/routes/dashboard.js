import { Router } from "express";
import { Contract } from "../models/Contract.js";
import { Crop } from "../models/Crop.js";
import { User } from "../models/User.js";
import { requireAuth } from "../services/auth.js";

const router = Router();

router.get("/dashboard/summary", requireAuth, async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;

  const contractFilter =
    role === "farmer" ? { farmerId: userId } : { buyerId: userId };

  const [totalCrops, allContracts, totalBuyers, totalFarmers] = await Promise.all([
    role === "farmer" ? Crop.countDocuments({ farmerId: userId }) : Crop.countDocuments(),
    Contract.find(contractFilter),
    User.countDocuments({ role: "buyer" }),
    User.countDocuments({ role: "farmer" }),
  ]);

  const activeContracts = allContracts.filter((c) => c.status === "active").length;
  const completedContracts = allContracts.filter((c) => c.status === "completed").length;
  const pendingContracts = allContracts.filter((c) => c.status === "pending").length;
  const totalRevenue = allContracts
    .filter((c) => c.status === "completed")
    .reduce((sum, c) => sum + c.agreedPrice * c.quantity, 0);

  res.json({
    totalCrops,
    activeContracts,
    completedContracts,
    pendingContracts,
    totalRevenue,
    totalBuyers,
    totalFarmers,
  });
});

router.get("/dashboard/recent-activity", requireAuth, async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;

  const contractFilter =
    role === "farmer" ? { farmerId: userId } : { buyerId: userId };

  const recentContracts = await Contract.find(contractFilter)
    .sort({ updatedAt: -1 })
    .limit(10);

  const userIds = [
    ...new Set(recentContracts.flatMap((c) => [c.farmerId.toString(), c.buyerId.toString()])),
  ];
  const users = await User.find({ _id: { $in: userIds } });
  const userMap = new Map(users.map((u) => [u._id.toString(), u]));

  const crops = await Crop.find({
    _id: { $in: recentContracts.map((c) => c.cropId) },
  });
  const cropMap = new Map(crops.map((c) => [c._id.toString(), c]));

  const activities = recentContracts.map((c) => {
    const crop = cropMap.get(c.cropId.toString());
    const otherUser =
      role === "farmer"
        ? userMap.get(c.buyerId.toString())
        : userMap.get(c.farmerId.toString());

    return {
      id: c._id.toString(),
      type: "contract_update",
      description: `Contract for ${crop?.title ?? "crop"} is now ${c.status}`,
      userId: otherUser?._id.toString() ?? userId.toString(),
      userName: otherUser?.name ?? "Unknown",
      createdAt: c.updatedAt.toISOString(),
    };
  });

  res.json(activities);
});

export default router;
