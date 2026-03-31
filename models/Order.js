

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: true },
  status: {
  type: String,
  enum: ["pending", "accepted", "rejected"], 
  default: "pending",
},
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);