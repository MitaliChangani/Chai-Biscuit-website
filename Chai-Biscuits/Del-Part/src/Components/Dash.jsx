import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

const Dash = () => {
  const [newOrders, setNewOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://127.0.0.1:8000/api";
  const partnerPhone = localStorage.getItem("userPhone");
  const partnerName = localStorage.getItem("userName");
  const socketRef = useRef(null);

  // WebSocket for real-time updates
  useEffect(() => {
    if (!partnerPhone) return;

    socketRef.current = new WebSocket("ws://localhost:8001/ws/orders/partner/");

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNewOrders((prev) => (!prev.find((o) => o.order_id === data.order_id) ? [...prev, data] : prev));
      setPendingOrders((prev) => prev.map((o) => (o.order_id === data.order_id ? { ...o, ...data } : o)));
    };

    socketRef.current.onclose = () => console.log("WebSocket disconnected");
    return () => socketRef.current?.close();
  }, [partnerPhone]);

  // Fetch orders from backend
  const fetchOrders = async () => {
    if (!partnerPhone) return;
    try {
      const [unassignedRes, assignedRes, historyRes] = await Promise.all([
        axios.get(`${API_BASE}/orders/unassigned/`),
        axios.get(`${API_BASE}/orders/assigned/?phone=${partnerPhone}`),
        axios.get(`${API_BASE}/orders/history/?phone=${partnerPhone}`),
      ]);

      setNewOrders(Array.isArray(unassignedRes.data) ? unassignedRes.data : []);
      setPendingOrders(Array.isArray(assignedRes.data) ? assignedRes.data : []);
      setCompletedOrders(Array.isArray(historyRes.data) ? historyRes.data : []);
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [partnerPhone]);

  const handleConfirm = async (orderId) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/orders/${orderId}/update-status/`,
        { status: "assigned", phone_number: partnerPhone },
        { headers: { "Content-Type": "application/json" } }
      );
      const updatedOrder = res.data.order || res.data;
      setNewOrders((prev) => prev.filter((o) => o.order_id !== orderId));
      setPendingOrders((prev) => [...prev, updatedOrder]);
    } catch (err) {
      console.error("Error confirming order:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to confirm order");
    }
  };

  const handleComplete = async (orderId) => {
    try {
      await axios.patch(
        `${API_BASE}/orders/${orderId}/update-status/`,
        { status: "delivered" },
        { headers: { "Content-Type": "application/json" } }
      );
      const res = await axios.get(`${API_BASE}/orders/history/?phone=${partnerPhone}`);
      setCompletedOrders(Array.isArray(res.data) ? res.data : []);
      setPendingOrders((prev) => prev.filter((o) => o.order_id !== orderId));
    } catch (err) {
      console.error("Error completing order:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to complete order");
    }
  };

  // Render orders
  const renderOrders = (orders, actionType) =>
    Array.isArray(orders) && orders.length > 0 ? (
      orders.map((order) => {
        const customer = order.user || {};
        const assigned = order.assigned_to || null;

        return (
          <div
            key={order.order_id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 hover:shadow-lg transition border-t-4"
            style={{ borderTopColor: '#a67b5b' }}
          >
            <div className="flex-1 text-center sm:text-left">
              <p className="font-bold text-lg text-[#a67b5b]">Order ID: {order.order_id}</p>
              <p><span className="font-semibold">Total:</span> ₹{order.total_amount || 0}</p>
              <p><span className="font-semibold">Status:</span> {order.delivery_status}</p>

              <p className="font-semibold mt-2">Customer Details:</p>
              <p>Name: {customer.name || "Unknown"}</p>
              <p>Phone: {customer.phone_number || "N/A"}</p>
              <p>Address: {customer.address || "N/A"}</p>

              {assigned && (
                <>
                  <p className="font-semibold mt-2">Assigned To:</p>
                  <p>{assigned.name} ({assigned.phone_number})</p>
                </>
              )}

              <p className="font-semibold mt-2">Items:</p>
              <ul className="list-disc ml-5">
                {order.items && order.items.length > 0
                  ? order.items.map((item, idx) => (
                      <li key={idx}>{item.item_name} x {item.quantity} @ ₹{item.price_per_item}</li>
                    ))
                  : <li>No item info</li>}
              </ul>

              {actionType === "confirm" && (
                <button
                  onClick={() => handleConfirm(order.order_id)}
                  className="mt-3 bg-[#a67b5b] hover:bg-[#8b5e3c] text-white px-4 py-2 rounded-lg font-semibold border border-[#a67b5b]"
                >
                  Confirm Order
                </button>
              )}
              {actionType === "complete" && (
                <button
                  onClick={() => handleComplete(order.order_id)}
                  className="mt-3 bg-[#a67b5b] hover:bg-[#8b5e3c] text-white px-4 py-2 rounded-lg font-semibold border border-[#a67b5b]"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        );
      })
    ) : (
      <p className="text-gray-500">No orders found.</p>
    );

  if (!partnerPhone) return <p className="text-center mt-20">Please log in first!</p>;
  if (loading) return <p className="text-center mt-20">Loading orders...</p>;

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8 mt-20" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#a67b5b' }}>Order Dashboard</h1>
        <p className="text-lg text-center mb-8">Welcome, {partnerName || "Delivery Partner"}!</p>

        <h2 className="text-2xl font-semibold mb-4" style={{ color: '#a67b5b' }}>New Orders</h2>
        <section className="grid gap-6 sm:grid-cols-2">{renderOrders(newOrders, "confirm")}</section>

        <h2 className="text-2xl font-semibold mt-10 mb-4" style={{ color: '#a67b5b' }}>Pending Orders</h2>
        <section className="grid gap-6 sm:grid-cols-2">{renderOrders(pendingOrders, "complete")}</section>

        <h2 className="text-2xl font-semibold mt-10 mb-4" style={{ color: '#a67b5b' }}>Completed Orders</h2>
        <section className="grid gap-6 sm:grid-cols-2">{renderOrders(completedOrders, "none")}</section>
      </div>
      <Footer />
    </>
  );
};

export default Dash;
