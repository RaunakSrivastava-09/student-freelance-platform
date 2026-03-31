import { connectDB } from "@/lib/db";
import Gig from "@/models/Gig";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sellerOnly = searchParams.get("seller");
    const id = searchParams.get("id"); // ✅ ADD THIS

    // 🔥 GET SINGLE GIG
    if (id) {
      const gig = await Gig.findById(id);
      return new Response(JSON.stringify(gig), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔥 SELLER GIGS
    if (sellerOnly === "true") {
      const token = req.headers.get("authorization")?.split(" ")[1];
      if (!token) return new Response(JSON.stringify({ message: "Not authorized" }), { status: 401 });

      let decoded;
      try {
        decoded = jwt.verify(token, "secretkey");
      } catch {
        return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
      }

      const gigs = await Gig.find({ userId: decoded.userId });

      return new Response(JSON.stringify(gigs), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔥 ALL GIGS
    const gigs = await Gig.find();

    return new Response(JSON.stringify(gigs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("GET GIG ERROR:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return new Response(JSON.stringify({ message: "Not authorized" }), { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, "secretkey");
    } catch {
      return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
    }

    const { title, description, price } = await req.json();

    if (!title || !description || !price) {
      return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }

    const gig = await Gig.create({
      title,
      description,
      price,
      userId: decoded.userId,
    });

    return new Response(JSON.stringify({ message: "Gig created successfully", gig }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("POST GIG ERROR:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}