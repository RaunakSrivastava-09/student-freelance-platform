import { connectDB } from "@/lib/db";
import Gig from "@/models/Gig";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    // Get token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ message: "Not authorized" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ message: "Not authorized" }), { status: 401 });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, "secretkey"); // replace "secretkey" with your actual secret
    } catch (err) {
      return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
    }

    // Fetch gigs created by this seller
    const gigs = await Gig.find({ userId: decoded.userId });

    // Ensure JSON array is returned
    return new Response(JSON.stringify(Array.isArray(gigs) ? gigs : []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}