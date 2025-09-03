import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

const OrderHistory = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in partner info from localStorage
  const partnerPhone = localStorage.getItem("userPhone");

  useEffect(() => {
  const fetchCompletedOrders = async () => {
    if (!partnerPhone) return;
    try {
      const res = await axios.get(`${API_BASE}/orders/history/?phone=${partnerPhone}`);
      setCompletedOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching completed orders:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };
  fetchCompletedOrders();
}, [partnerPhone]);

  return (
    <>
      <Header />
  <div className="max-w-6xl mx-auto px-2 py-10 mb-10">
        <h1 className="text-3xl font-bold text-center mt-16 mb-10 text-neutral-800">Order History</h1>
        {loading ? (
          <p className="text-center text-lg text-neutral-400 animate-pulse">Loading...</p>
        ) : (
          <section className="grid gap-x-16 gap-y-12 md:grid-cols-2">
            {completedOrders.length === 0 ? (
              <p className="text-neutral-400 col-span-2 text-center text-lg">No completed orders found.</p>
            ) : (
              completedOrders.map((order) => {
                let statusChip = "bg-green-100 text-green-700 border-green-200";
                if (order.status === "cancelled") statusChip = "bg-red-100 text-red-700 border-red-200";
                return (
                  <div
                    key={order.order_id}
                    className="bg-neutral-50 border border-neutral-200 rounded-2xl shadow flex flex-col p-8 min-h-[180px] w-full max-w-2xl mx-auto transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 hover:border-blue-400 cursor-pointer"
                  >
                    <div className={`self-end mb-4 px-5 py-1 rounded-full border text-sm font-semibold uppercase tracking-wide ${statusChip}`}>{order.status}</div>
                    <div className="grid grid-cols-[140px_1fr] gap-y-3 gap-x-6">
                      <span className="text-base text-neutral-500 font-semibold">Order ID:</span>
                      <span className="text-lg font-mono text-neutral-800 break-words whitespace-pre-wrap max-w-full" style={{wordBreak: 'break-all'}}>{order.order_id}</span>
                      <span className="text-sm text-neutral-500 font-medium">Total:</span>
                      <span className="font-bold text-neutral-800">₹{order.total_amount}</span>
                      <span className="text-sm text-neutral-500 font-medium">Assigned To:</span>
                      {order.assigned_to ? (
                        <span className="font-medium text-neutral-700">{order.assigned_to.name} <span className="text-xs text-neutral-400">({order.assigned_to.phone_number})</span></span>
                      ) : (
                        <span className="italic text-neutral-400">Not assigned</span>
                      )}
                      <span className="text-sm text-neutral-500 font-medium pt-1">Items:</span>
                      <ul className="list-disc ml-5 mt-1 text-sm text-neutral-700">
                        {order.items && order.items.length > 0
                          ? order.items.map((item, idx) => (
                              <li key={idx} className="mb-1">
                                <span className="font-medium">{item.item_name}</span> x {item.quantity} <span className="text-neutral-400">@ ₹{item.price_per_item}</span>
                              </li>
                            ))
                          : <li className="italic text-neutral-400">No item info</li>}
                      </ul>
                      {order.completed_at && (
                        <>
                          <span className="text-sm text-neutral-500 font-medium">Completed At:</span>
                          <span className="font-medium text-neutral-700">{order.completed_at ? new Date(order.completed_at).toLocaleString() : ""}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </section>
        )}
      </div>
    </>
  );
};

export default OrderHistory;