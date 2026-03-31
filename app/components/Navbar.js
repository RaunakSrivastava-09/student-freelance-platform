

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const router = useRouter();
  const pathname = usePathname(); 
  const updateAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setRole(decoded.role);
      } catch (err) {
        console.log("Token error:", err);
        setRole(null);
      }
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  };

 
  useEffect(() => {
    updateAuth();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    updateAuth();
    router.push("/");
  };

  return (
    <div className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">Freelance</h1>

      <div className="flex gap-4 items-center">
        <Link href="/">Home</Link>
        <Link href="/gigs">Gigs</Link>

        {isLoggedIn && role === "seller" && (
          <>
            <Link href="/seller/gigs/create">Create Gig</Link>
            <Link href="/seller/dashboard">Dashboard</Link>
          </>
        )}

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