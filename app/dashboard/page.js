


"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (Array.isArray(data)) setOrders(data);
      else if (data.orders && Array.isArray(data.orders)) setOrders(data.orders);
      else setOrders([]);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchOrders();

    
    const handleStorage = () => fetchOrders();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const getStatusColor = (status) => {
    if (status === "completed") return "text-green-600 bg-green-100";
    if (status === "pending") return "text-yellow-600 bg-yellow-100";
    if (status === "cancelled") return "text-red-600 bg-red-100";
    return "text-gray-600 bg-gray-100";
  };

  if (loading) return <p className="text-gray-900 text-center mt-8">Loading orders...</p>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center sm:text-left">
        My Orders 📦
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {orders.length === 0 ? (
          <p className="text-gray-900 text-center text-lg sm:text-xl col-span-full break-words">
            No orders found.
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition border border-gray-200 break-words w-full"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 break-words">
                {order.gigId?.title || "Untitled Gig"}
              </h2>
              <p className="text-gray-700 text-sm sm:text-base mb-2 break-words">
                {order.gigId?.description || "No description"}
              </p>
              <p className="text-green-600 font-bold text-lg mb-2">₹{order.price}</p>
              <span
                className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
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