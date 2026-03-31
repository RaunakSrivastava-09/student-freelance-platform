"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    setIsLoggedIn(true);

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      console.log("ROLE:", decoded.role); 
      setRole(decoded.role);
    } catch (err) {
      console.log("Token error:", err);
      setRole(null);
    }
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">  Freelance </h1>

      <div className="flex gap-4 items-center">
        <Link href="/">Home</Link>
        <Link href="/gigs">Gigs</Link>

        {/* ✅ SELLER NAV */}
        {isLoggedIn && role === "seller" && (
          <>
            <Link href="/seller/gigs/create">Create Gig</Link>
            <Link href="/seller/dashboard">Dashboard</Link>
          </>
        )}

        {/* ✅ BUYER NAV */}
        {isLoggedIn && role === "buyer" && (
          <Link href="/dashboard">Dashboard</Link>
        )}

        {!isLoggedIn ? (
          <Link href="/login">Login</Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}