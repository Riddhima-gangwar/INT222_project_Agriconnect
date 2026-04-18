import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    contractId: { type: Schema.Types.ObjectId, ref: "Contract", default: null },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
