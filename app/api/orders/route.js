import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// POST: create new order
export async function POST(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ message: "Not authorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, "secretkey");
    } catch {
      return Response.json({ message: "Invalid token" }, { status: 401 });
    }

    const { gigId, sellerId, price } = await req.json();

    // ✅ VALIDATION (prevents 500 error)
    if (!gigId || !sellerId || !price) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const order = await Order.create({
      gigId: new mongoose.Types.ObjectId(gigId),
      sellerId: new mongoose.Types.ObjectId(sellerId),
      buyerId: new mongoose.Types.ObjectId(decoded.userId),
      price,
      status: "pending",
    });

    return Response.json({ message: "Order created", order });
  } catch (error) {
    console.log("POST ORDER ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// GET: fetch orders for buyer or seller
export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) return Response.json({ message: "Not authorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    if (!token) return Response.json({ message: "Not authorized" }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, "secretkey");
    } catch {
      return Response.json({ message: "Invalid token" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(decoded.userId);
    let orders = [];

  if (decoded.role === "buyer") {
  orders = await Order.find({ buyerId: userId })
    .populate("gigId")
    .populate("buyerId", "name email"); 
} else if (decoded.role === "seller") {
  orders = await Order.find({ sellerId: userId })
    .populate("gigId")
    .populate("buyerId", "name email"); 
}

    if (!Array.isArray(orders)) orders = [];
    return Response.json(orders);

  } catch (error) {
    console.log("GET ORDER ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}