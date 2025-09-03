import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Parse "03:30 PM" into Date
  const parseTime = (timeStr) => {
    if (!timeStr) return new Date();
    const [hourMin, period] = timeStr.split(' ');
    let [hours, minutes] = hourMin.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  };

  // ✅ Fetch order status from backend API
  const fetchOrderStatus = async (orderId) => {
    if (!orderId) {
      console.warn("Skipping fetchOrderStatus because orderId is undefined");
      return null;
    }

    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/orders/${orderId}/status/`, {
        withCredentials: true,
      });

      console.log("API order response for", orderId, res.data);
      const backendOrder = res.data;

      return {
        order_id: backendOrder.order_id,
        placedAt: backendOrder.placed_at,
        deliveryTime: backendOrder.delivery_time,
        delivery_status: backendOrder.delivery_status,
        total: parseFloat(backendOrder.total_amount || 0),
        items: backendOrder.items?.map(it => ({
          name: it.item_name,
          quantity: it.quantity,
          price: parseFloat(it.price_per_item || 0),
        })) || [],
        assigned_to: backendOrder.assigned_to || null,
        delivery_address: backendOrder.delivery_address || '',  // preserve address
      };
    } catch (err) {
      console.error(`Failed to fetch order ${orderId}:`, err);
      return null;
    }
  };

  // Load from localStorage, sync with API, and filter active orders
  const updateOrdersFromStorage = async () => {
    let storedOrders = JSON.parse(localStorage.getItem('allOrders')) || [];

    // Filter out any orders without order_id
    storedOrders = storedOrders.filter(o => o.order_id);

    const updatedOrders = await Promise.all(
      storedOrders.map(async (order) => {
        const apiOrder = await fetchOrderStatus(order.order_id);
        if (apiOrder) {
          return {
            ...order,
            delivery_status: apiOrder.delivery_status || order.delivery_status,
            assigned_to: apiOrder.assigned_to || null,
            delivery_address: apiOrder.delivery_address || order.delivery_address,
          };
        }
        return order;
      })
    );

    const activeOrders = updatedOrders
      .filter(order =>
        !["delivered", "cancelled"].includes(order.delivery_status) &&
        ((order.deliveryTime && currentTime < parseTime(order.deliveryTime)) ||
          (!order.deliveryTime && ['placed', 'assigned'].includes(order.delivery_status)))
      )
      .sort((a, b) => parseTime(b.placedAt) - parseTime(a.placedAt));

    setOrders(activeOrders);
    localStorage.setItem('allOrders', JSON.stringify(activeOrders));
  };



  // WebSocket for real-time updates
  useEffect(() => {
    const userPhone = localStorage.getItem('phone_number');
    if (!userPhone) return;

    const ws = new WebSocket(`ws://localhost:8001/ws/orders/user_${userPhone}/`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.order || !data.order.order_id) return;  // ✅ skip if no orderId

        const backendOrder = data.order;
        const status = (backendOrder.delivery_status || backendOrder.status || "").toLowerCase();

        const normalizedOrder = {
          order_id: backendOrder.order_id,
          placedAt: backendOrder.placed_at,
          deliveryTime: backendOrder.delivery_time,
          delivery_status: status,
          total: parseFloat(backendOrder.total_amount || 0),
          items: backendOrder.items?.map(it => ({
            name: it.item_name,
            quantity: it.quantity,
            price: parseFloat(it.price_per_item || 0),
          })) || [],
          assigned_to: backendOrder.assigned_to || null,
          delivery_address: backendOrder.delivery_address || '',
        };

        let allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
        let notified = JSON.parse(localStorage.getItem("cancelNotified")) || [];

        if (status === "cancelled" || status === "delivered") {
          if (status === "cancelled" && !notified.includes(normalizedOrder.order_id)) {
            alert(`❌ Your order ${normalizedOrder.order_id} has been cancelled.`);
            notified.push(normalizedOrder.order_id);
            localStorage.setItem("cancelNotified", JSON.stringify(notified));
          }
          allOrders = allOrders.filter(o => o.order_id !== normalizedOrder.order_id);
        } else {
          const idx = allOrders.findIndex(o => o.order_id === normalizedOrder.order_id);
          if (idx !== -1) {
            allOrders[idx] = { ...allOrders[idx], ...normalizedOrder };
          } else {
            allOrders.push(normalizedOrder);
          }
        }

        localStorage.setItem("allOrders", JSON.stringify(allOrders));
        updateOrdersFromStorage();
      } catch (e) {
        console.error("WebSocket parse error:", e);
      }
    };

    ws.onerror = () => console.error('WebSocket error');
    ws.onclose = () => console.log('WebSocket closed');
    return () => ws.close();
  }, []);

  useEffect(() => {
    updateOrdersFromStorage(); // initial fetch
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      updateOrdersFromStorage();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getSteps = (order) => [
    {
      label: 'Order Placed',
      timeStr: order.placedAt || 'N/A',
      completed: true,
    },
    {
      label: 'Delivered',
      timeStr: order.deliveryTime
        ? parseTime(order.deliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        : 'N/A',
      completed: order.delivery_status === "delivered"
        || (order.deliveryTime ? currentTime >= parseTime(order.deliveryTime) : false),
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#fef6f3] p-4 sm:p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-[#4b2c20] mb-6">Track Your Orders</h1>
          {orders.length === 0 ? (
            <p className="text-center text-gray-600">No active orders. All orders have been delivered.</p>
          ) : (
            orders.map((order, index) => {
              const steps = getSteps(order);
              return (
                <div key={index} className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-10">
                  {/* Estimated Delivery */}
                  <div className="bg-[#fff3eb] p-4 rounded-lg mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="text-lg font-semibold text-[#4b2c20]">Today, {steps[1].timeStr}</p>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      {order.delivery_status === "delivered" ? 'Delivered' : 'On Time'}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="relative border-l-4 border-[#d3b9af] ml-3 pl-6 space-y-6">
                    {steps.map((step, i) => (
                      <div key={i} className="relative">
                        <div
                          className={`absolute -left-[1.55rem] top-1 w-6 h-6 rounded-full border-4 ${step.completed ? 'bg-green-500 border-green-200' : 'bg-gray-300 border-gray-200'
                            }`}
                        ></div>
                        <div>
                          <p className="text-md font-semibold text-[#4b2c20]">{step.label}</p>
                          <p className="text-sm text-gray-500">{step.timeStr}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Partner */}
                  <div className="mt-8 border-t pt-6">
                    <h2 className="text-lg font-semibold text-[#4b2c20] mb-2">Delivery Partner</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-md font-medium text-[#4b2c20]">
                          {order.assigned_to?.name || (
                            <span className="italic text-gray-400">Not assigned yet</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.assigned_to?.phone_number ? (
                            `+91 ${order.assigned_to.phone_number}`
                          ) : (
                            <span className="italic text-gray-300">No contact available</span>
                          )}
                        </p>
                      </div>
                      {order.assigned_to?.phone_number ? (
                        <a
                          href={`tel:+91${order.assigned_to.phone_number}`}
                          className="bg-[#4b2c20] text-white px-4 py-2 rounded-full text-sm hover:bg-[#3e241b] transition text-center min-w-[80px]">
                          Call
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300 px-4 py-2 rounded-full border border-gray-200 bg-gray-100 text-center min-w-[80px]">
                          No Call
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-8 border-t pt-6">
                    <h2 className="text-lg font-semibold text-[#4b2c20] mb-2">Order Summary</h2>
                    <ul className="text-sm text-gray-700 space-y-2">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                      <li className="flex justify-between font-semibold text-[#4b2c20] border-t pt-2">
                        <span>Total</span>
                        <span>₹{order.total.toFixed(2)}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TrackOrder;
