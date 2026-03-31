import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function PATCH(req) {
  await connectDB();

  const { orderId, status } = await req.json();
  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  return Response.json(order);
}