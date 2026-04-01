
import { connectDB } from "@/lib/db";
import Gig from "@/models/Gig";
import jwt from "jsonwebtoken";
import User from "@/models/User"; 

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sellerOnly = searchParams.get("seller");
    const id = searchParams.get("id"); 

    
    if (id) {
      const gig = await Gig.findById(id);

   
      const user = await User.findById(gig.userId).select("name");

      return new Response(JSON.stringify({ ...gig.toObject(), sellerName: user?.name }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

   
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

    
      const user = await User.findById(decoded.userId).select("name");
      const updatedGigs = gigs.map(g => ({
        ...g.toObject(),
        sellerName: user?.name,
      }));

      return new Response(JSON.stringify(updatedGigs), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

   
    const gigs = await Gig.find();

    // ✅ ADD SELLER NAME FOR ALL GIGS
    const updatedGigs = await Promise.all(
      gigs.map(async (g) => {
        const user = await User.findById(g.userId).select("name");
        return {
          ...g.toObject(),
          sellerName: user?.name,
        };
      })
    );

    return new Response(JSON.stringify(updatedGigs), {
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


export async function DELETE(req) {
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ message: "Gig ID required" }), { status: 400 });
    }

    const gig = await Gig.findById(id);

    if (!gig) {
      return new Response(JSON.stringify({ message: "Gig not found" }), { status: 404 });
    }

    // ✅ CHECK OWNER
    if (gig.userId.toString() !== decoded.userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
    }

    await Gig.findByIdAndDelete(id);

    return new Response(JSON.stringify({ message: "Gig deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("DELETE GIG ERROR:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}