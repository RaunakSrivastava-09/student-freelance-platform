



import User from "@/models/User";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();
  const user = await User.findOne({ email });

  if (!user) return Response.json({ message: "User not found" }, { status: 404 });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return Response.json({ message: "Invalid password" }, { status: 401 });

  const token = jwt.sign({ userId: user._id, role: user.role }, "secretkey", { expiresIn: "7d" });
  return Response.json({ token });
}