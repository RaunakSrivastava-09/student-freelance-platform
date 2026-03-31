import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function GET(req) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return Response.json({ message: "Not authorized" }, { status: 401 });

  const decoded = jwt.verify(token, "secretkey");
  const userId = new mongoose.Types.ObjectId(decoded.userId);

  // Orders where the user is the seller
  const orders = await Order.find({ sellerId: userId }).populate("gigId");
  return Response.json(orders);
}