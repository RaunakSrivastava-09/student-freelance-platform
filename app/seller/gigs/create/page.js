
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateGig() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", price: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in as a seller!");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/gigs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Gig created successfully!");
        router.push("/seller/dashboard");
      } else {
        alert(data.message || "Failed to create gig");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 px-4">

      <div className="backdrop-blur-xl bg-white/80 p-8 rounded-3xl shadow-2xl 
                      w-full max-w-md border border-white/40">

        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Create a New Gig
        </h2>
        <p className="text-center text-gray-500 mt-2 mb-6 text-sm">
          Fill in the details below to create your gig
        </p>

        {/* Title */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Title</label>
          <input
            type="text"
            placeholder="Enter gig title"
            className="w-full mt-1 p-3 rounded-xl border border-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 
                       bg-white shadow-sm"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Description</label>
          <textarea
            placeholder="Enter gig description"
            className="w-full mt-1 p-3 rounded-xl border border-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 
                       bg-white shadow-sm"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="text-sm text-gray-600">Price (₹)</label>
          <input
            type="number"
            placeholder="Enter price"
            className="w-full mt-1 p-3 rounded-xl border border-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 
                       bg-white shadow-sm"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full p-3 rounded-xl font-semibold text-lg text-white
                     bg-gradient-to-r from-purple-600 to-indigo-600
                     hover:from-purple-700 hover:to-indigo-700
                     transition duration-300 ease-in-out
                     shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? "Creating..." : "Create Gig"}
        </button>

      </div>
    </div>
  );
}