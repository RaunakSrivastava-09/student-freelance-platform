
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Gigs() {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/gigs", { cache: "no-store" }) 
      .then((res) => res.json())
      .then((data) => setGigs(data));
  }, []);

  const filteredGigs = gigs.filter((gig) =>
    gig.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
     
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Explore Gigs 
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search gigs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-3 rounded-xl border shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredGigs.map((gig) => (
          <Link key={gig._id} href={`/gigs/${gig._id}`}>
            <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer border border-gray-200">
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {gig.title}
              </h3>

             
              <p className="text-xs text-gray-500 mb-1">
                Created by: {gig.sellerName || "Unknown"}
              </p>

              <p className="text-gray-600 text-sm line-clamp-2">
                {gig.description}
              </p>

              <p className="text-green-600 font-bold mt-3 text-lg">
                ₹{gig.price}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filteredGigs.length === 0 && (
        <p className="text-center mt-10 text-gray-700">No gigs found 😢</p>
      )}
    </div>
  );
}