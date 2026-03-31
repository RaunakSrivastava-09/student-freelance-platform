"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push(form.role === "seller" ? "/seller/dashboard" : "/gigs");
      } else {
        alert(data.message);
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

      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-500 text-sm mt-1 mb-6">
          Join us and start your journey
        </p>

        <input
          type="text"
          placeholder="Your Name"
          className="w-full mt-1 p-3 mb-3 rounded-xl border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-pink-400 
                     bg-white text-gray-900 shadow-sm"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Your Email"
          className="w-full mt-1 p-3 mb-3 rounded-xl border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-purple-400 
                     bg-white text-gray-900 shadow-sm"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Your Password"
          className="w-full mt-1 p-3 mb-4 rounded-xl border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 
                     bg-white text-gray-900 shadow-sm"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="w-full mt-1 p-3 mb-5 rounded-xl border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-purple-400 
                     bg-white text-gray-900 shadow-sm"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="buyer">👤 Buyer</option>
          <option value="seller">💼 Seller</option>
        </select>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full p-3 rounded-xl font-semibold text-white text-lg
                     bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                     hover:opacity-90 transition duration-300
                     shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-purple-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}