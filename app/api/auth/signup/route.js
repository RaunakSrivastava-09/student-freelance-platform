import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password, role } = await req.json(); 

    
    if (!name || !email || !password || !role) {
      return Response.json({ message: "All fields required" }, { status: 400 });
    }

  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: "User already exists" }, { status: 400 });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role, 
    });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role, 
      },
      "secretkey",
      { expiresIn: "7d" }
    );

    return Response.json({
      message: "User created successfully",
      token, 
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}