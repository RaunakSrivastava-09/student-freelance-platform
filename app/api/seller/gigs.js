import { connectDB } from "@/lib/db";
import Gig from "@/models/Gig";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function GET(req) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return Response.json({ message: "Not authorized" }, { status: 401 });

  const decoded = jwt.verify(token, "secretkey");
  const userId = new mongoose.Types.ObjectId(decoded.userId);

  const gigs = await Gig.find({ userId });
  return Response.json(gigs);
}