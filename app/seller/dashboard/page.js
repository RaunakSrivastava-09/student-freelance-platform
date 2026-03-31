


"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SellerDashboard() {
  const [gigs, setGigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/orders/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ orderId, status }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status } : o
          )
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log("Update Error:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const gigsRes = await fetch("/api/gigs?seller=true", {
          headers: { Authorization: "Bearer " + token },
        });
        const gigsData = await gigsRes.json();
        setGigs(Array.isArray(gigsData) ? gigsData : []);

        const ordersRes = await fetch("/api/orders", {
          headers: { Authorization: "Bearer " + token },
        });
        const ordersData = await ordersRes.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        console.log("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-purple-600 font-semibold">
        Loading...
      </p>
    );

  return (
    <div className="p-6 bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 min-h-screen">

      {/* ================= GIGS ================= */}
      <h1 className="text-3xl font-bold mb-4 text-purple-700">
        My Gigs 🎯
      </h1>

      {gigs.length === 0 && (
        <p className="text-gray-600">No gigs created yet.</p>
      )}

      {gigs.map((gig) => (
        <div
          key={gig._id}
          className="p-4 mb-4 rounded-xl shadow-md bg-white border-l-4 border-purple-500 hover:shadow-lg transition"
        >
          <h3 className="font-semibold text-lg text-gray-800">
            {gig.title || "Untitled Gig"}
          </h3>

          <p className="text-gray-600">
            {gig.description || "No description"}
          </p>

          <p className="text-purple-600 font-bold mt-1">
            ₹{gig.price || 0}
          </p>
        </div>
      ))}

      {/* ================= ORDERS ================= */}
      <h1 className="text-3xl font-bold mt-10 mb-4 text-indigo-700">
        Orders Received 📦
      </h1>

      {orders.length === 0 && (
        <p className="text-gray-600">No orders yet.</p>
      )}

      {orders.map((order) => (
        <div
          key={order._id}
          className="p-4 mb-4 rounded-xl shadow-md bg-white border-l-4 border-indigo-500 hover:shadow-lg transition"
        >
          <h3 className="font-semibold text-lg text-gray-800">
            {order.gigId?.title || "Untitled Gig"}
          </h3>

          <p className="text-sm text-gray-500">
            Ordered by: {order.buyerId?.name || "Unknown User"}
          </p>

          <p className="text-gray-600">
            {order.gigId?.description || "No description"}
          </p>

          <p className="text-indigo-600 font-bold mt-1">
            ₹{order.gigId?.price || 0}
          </p>

       
          <p className="mt-2">
            Status:{" "}
            <span
              className={`font-semibold ${
                order.status === "accepted"
                  ? "text-green-600"
                  : order.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {order.status}
            </span>
          </p>

       
          {order.status === "pending" && (
            <div className="flex gap-3 mt-3">
              <button
                onClick={() =>
                  updateOrderStatus(order._id, "accepted")
                }
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg shadow"
              >
                Accept
              </button>

              <button
                onClick={() =>
                  updateOrderStatus(order._id, "rejected")
                }
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow"
              >
                Reject
              </button>
            </div>
          )}

        
          <Link href={`/chat/${order._id}`}>
            <button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg shadow">
              Chat 💬
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}