
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function GigPage() {
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [isOwner, setIsOwner] = useState(false); 
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/gigs?id=${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setGig(data);

      
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            if (decoded.userId === data.userId) {
              setIsOwner(true);
            }
          } catch (err) {
            console.log("Token error:", err);
          }
        }
      });
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


  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this gig?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/gigs?id=${gig._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Gig deleted successfully");
        router.push("/seller/dashboard"); 
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (!gig) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-2">{gig.title}</h1>

       
        <p className="text-sm text-gray-500 mb-2">
          Created by: {gig.sellerName || "Unknown"}
        </p>

        <p className="text-gray-600 mb-4">{gig.description}</p>

        <h2 className="text-green-600 font-bold text-xl mb-4">
          ₹{gig.price}
        </h2>

       
        {isOwner && (
          <button
            onClick={handleDelete}
            className="w-full bg-red-500 text-white p-2 rounded mb-3 hover:bg-red-600"
          >
            Delete Gig
          </button>
        )}

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