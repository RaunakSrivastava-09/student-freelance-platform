


"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        // Make sure data is an array
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]);
          console.warn("Orders API did not return an array:", data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    if (status === "completed") return "text-green-600 bg-green-100";
    if (status === "pending") return "text-yellow-600 bg-yellow-100";
    if (status === "cancelled") return "text-red-600 bg-red-100";
    return "text-gray-600 bg-gray-100";
  };

  if (!orders) return <p>Loading orders...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders 📦</h1>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {order.gigId?.title || "Untitled Gig"}
              </h2>
              <p className="text-gray-600 text-sm mb-2">
                {order.gigId?.description || "No description"}
              </p>
              <p className="text-green-600 font-bold text-lg mb-2">
                ₹{order.price}
              </p>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}