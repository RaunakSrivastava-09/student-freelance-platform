import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
  },
  { timestamps: true }
);

export default mongoose.models.Message ||mongoose.model("Message", MessageSchema);