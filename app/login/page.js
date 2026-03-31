


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);

        const decoded = JSON.parse(atob(data.token.split(".")[1]));

        if (decoded.role === "seller") {
          router.push("/seller/dashboard");
        } else {
          router.push("/gigs");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Try again!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 px-4">

     
      <div className="backdrop-blur-xl bg-white/80 p-8 rounded-3xl shadow-2xl 
                      w-full max-w-md border border-white/40">

      
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mt-2 mb-6 text-sm">
          Login to continue your journey
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mt-1 p-3 rounded-xl border border-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 
                       bg-white shadow-sm"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full mt-1 p-3 rounded-xl border border-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 
                       bg-white shadow-sm"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full p-3 rounded-xl font-semibold text-lg text-white
                     bg-gradient-to-r from-purple-600 to-indigo-600
                     hover:from-purple-700 hover:to-indigo-700
                     transition duration-300 ease-in-out
                     shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

      
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-purple-600 font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}