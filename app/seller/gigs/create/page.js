

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateGig() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", price: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in as a seller!");
      router.push("/login");
      return;
    }

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
        router.push("/seller/dashboard"); // go to seller dashboard after creation
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Gig</h2>

        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-3 mb-4 border rounded"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 mb-4 border rounded"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full p-3 mb-4 border rounded"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Creating..." : "Create Gig"}
        </button>
      </div>
    </div>
  );
}