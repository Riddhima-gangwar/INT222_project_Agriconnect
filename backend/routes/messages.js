import { Router } from "express";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { requireAuth } from "../services/auth.js";

const router = Router();

router.get("/messages", requireAuth, async (req, res) => {
  const userId = req.user._id;
  const { contractId, withUserId } = req.query;
  const filter = {
    $or: [{ senderId: userId }, { receiverId: userId }],
  };

  if (contractId) filter.contractId = contractId;
  if (withUserId) {
    filter.$or = [
      { senderId: userId, receiverId: withUserId },
      { senderId: withUserId, receiverId: userId },
    ];
  }

  const messages = await Message.find(filter).sort({ createdAt: 1 });
  const senderIds = [...new Set(messages.map((m) => m.senderId.toString()))];
  const senders = await User.find({ _id: { $in: senderIds } });
  const senderMap = new Map(senders.map((s) => [s._id.toString(), s]));

  res.json(
    messages.map((m) => ({
      id: m._id.toString(),
      contractId: m.contractId?.toString() ?? null,
      senderId: m.senderId.toString(),
      senderName: senderMap.get(m.senderId.toString())?.name ?? "Unknown",
      receiverId: m.receiverId.toString(),
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    }))
  );
});

router.post("/messages", requireAuth, async (req, res) => {
  const { receiverId, content, contractId } = req.body;

  const message = await Message.create({
    receiverId,
    content,
    contractId: contractId ?? null,
    senderId: req.user._id,
  });

  res.status(201).json({
    id: message._id.toString(),
    contractId: message.contractId?.toString() ?? null,
    senderId: message.senderId.toString(),
    senderName: req.user.name,
    receiverId: message.receiverId.toString(),
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  });
});

router.get("/messages/conversations", requireAuth, async (req, res) => {
  const userId = req.user._id;

  const messages = await Message.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  }).sort({ createdAt: -1 });

  const conversationMap = new Map();
  for (const msg of messages) {
    const otherId =
      msg.senderId.toString() === userId.toString()
        ? msg.receiverId.toString()
        : msg.senderId.toString();
    if (!conversationMap.has(otherId)) {
      conversationMap.set(otherId, msg);
    }
  }

  const otherIds = [...conversationMap.keys()];
  const otherUsers = await User.find({ _id: { $in: otherIds } });
  const userMap = new Map(otherUsers.map((u) => [u._id.toString(), u]));

  const conversations = otherIds.map((otherId) => {
    const lastMsg = conversationMap.get(otherId);
    const other = userMap.get(otherId);
    return {
      userId: otherId,
      userName: other?.name ?? "Unknown",
      userRole: other?.role ?? "buyer",
      lastMessage: lastMsg.content,
      lastMessageAt: lastMsg.createdAt.toISOString(),
      unreadCount: 0,
    };
  });

  res.json(conversations);
});

export default router;
