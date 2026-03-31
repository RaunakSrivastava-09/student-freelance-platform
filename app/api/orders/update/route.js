import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

export async function PATCH(req) {
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

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return Response.json({ message: "Missing fields" }, { status: 400 });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return Response.json({ message: "Order not found" }, { status: 404 });
    }

 
if (order.sellerId.toString() !== decoded.userId.toString()) {
  return Response.json({ message: "Unauthorized" }, { status: 403 });
}

    order.status = status;
    await order.save();

    return Response.json({ message: "Order updated", order });

  } catch (error) {
    console.log("UPDATE ORDER ERROR:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}