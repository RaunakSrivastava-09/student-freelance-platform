"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function GigPage() {
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(false); 
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
  fetch(`/api/gigs?id=${params.id}`)
      .then((res) => res.json())
      .then((data) => setGig(data));
  }, [params]);


const handleBuy = async () => {
  if (loading) return;
  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    if (!gig?._id || !gig.userId || !gig.price) {
      alert("Gig data not loaded properly");
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        gigId: gig._id,
        sellerId: gig.userId, 
        price: gig.price,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Order placed successfully ");
      router.push("/dashboard");
    } else {
      alert(data.message || "Error placing order");
    }

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }

  setLoading(false);
};
  if (!gig) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-2">{gig.title}</h1>
        <p className="text-gray-600 mb-4">{gig.description}</p>
        <h2 className="text-green-600 font-bold text-xl mb-4">
          ₹{gig.price}
        </h2>

      
        <button
          onClick={handleBuy}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? "Processing..." : "Buy Now"}
        </button>
      </div>
    </div>
  );
}