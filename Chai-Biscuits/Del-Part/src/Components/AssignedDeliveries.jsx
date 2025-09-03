import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const API_BASE = "http://127.0.0.1:8000/api";

const AssignedDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [completedDeliveries, setCompletedDeliveries] = useState([]);
    const [activeTab, setActiveTab] = useState('today');
    const navigate = useNavigate();

    const partnerPhone = localStorage.getItem("userPhone");

    useEffect(() => {
        if (!partnerPhone) return;

        const fetchAssigned = async () => {
            try {
                const res = await axios.get(`${API_BASE}/orders/assigned/?phone=${partnerPhone}`);
                setDeliveries(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                setDeliveries([]);
            }
        };

        const fetchCompleted = async () => {
            try {
                const res = await axios.get(`${API_BASE}/orders/history/?phone=${partnerPhone}`);
                setCompletedDeliveries(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                setCompletedDeliveries([]);
            }
        };

        fetchAssigned();
        fetchCompleted();
    }, [partnerPhone]);

    const handleViewDetails = (id) => {
        navigate(`/delivery/${id}`);
    };

    // Choose which deliveries to show based on tab
    const shownDeliveries = activeTab === 'today' ? deliveries : completedDeliveries;

    // Cancel order handler
    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            await axios.patch(`${API_BASE}/orders/${orderId}/update-status/`, {
                status: 'cancelled', // must match backend STATUS_CHOICES
                cancelled_by: 'partner',
                phone_number: partnerPhone
            });
            // Remove from deliveries list
            setDeliveries((prev) => prev.filter((o) => o.order_id !== orderId));
            alert('Order cancelled. The customer will be notified.');
        } catch (err) {
            alert('Failed to cancel order.');
        }
    };

    return (
        <>
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-6 mt-20 text-center">
                <h2 className="text-3xl font-bold mb-8 tracking-wide" style={{ color: '#a67b5b' }}>
                    Assigned Deliveries
                </h2>
                <div className="rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center min-h-[250px] border" style={{ background: 'linear-gradient(135deg, #f5f5f4 0%, #f3e7db 100%)', borderColor: '#e2cfc3' }}>
                    <div className="flex gap-4 mb-8">
                        {['today', 'completed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={activeTab === tab
                                    ? { background: '#a67b5b', color: 'white', borderColor: '#a67b5b', transform: 'scale(1.05)' }
                                    : { background: 'white', color: '#a67b5b', borderColor: '#e2cfc3' }
                                }
                                className={`px-7 py-2 rounded-full font-semibold text-lg transition-all duration-200 shadow-sm border-2`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    {shownDeliveries.length === 0 ? (
                        <p className="text-gray-400 italic text-lg">No deliveries found.</p>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full">
                            {shownDeliveries.map((order) => (
                                <div
                                    key={order.order_id}
                                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-200 flex flex-col justify-between min-h-[320px] border"
                                    style={{ borderColor: '#e2cfc3' }}
                                >
                                    <div>
                                        <p className="text-base mb-1" style={{ color: '#7c5a3a' }}>
                                            <span className="font-bold">Order ID:</span> {order.order_id}
                                        </p>
                                        <p className="text-base mb-1" style={{ color: '#7c5a3a' }}>
                                            <span className="font-bold">Total:</span> ₹{order.total_amount || order.earnings || 0}
                                        </p>
                                        <p className="text-base mb-1" style={{ color: '#7c5a3a' }}>
                                            <span className="font-bold">Status:</span> {order.delivery_status || order.status}
                                        </p>
                                        <p className="text-base mb-1" style={{ color: '#7c5a3a' }}>
                                            <span className="font-bold">Assigned To:</span> {order.assigned_to?.name ? `${order.assigned_to.name} (${order.assigned_to.phone_number})` : order.name && order.phone_number ? `${order.name} (${order.phone_number})` : "Not assigned"}
                                        </p>
                                        <p className="text-base mb-1 font-bold" style={{ color: '#7c5a3a' }}>Items:</p>
                                        <ul className="list-disc ml-6" style={{ color: '#a67b5b' }}>
                                            {order.items && order.items.length > 0
                                                ? order.items.map((item, idx) => (
                                                    <li key={idx} className="mb-1">
                                                        {item.item_name} x {item.quantity} @ ₹{item.price_per_item}
                                                    </li>
                                                ))
                                                : <li className="text-gray-400">No item info</li>}
                                        </ul>
                                        {order.completed_at && (
                                            <p className="text-base mt-2" style={{ color: '#7c5a3a' }}>
                                                <span className="font-bold">Completed At:</span> {order.completed_at ? new Date(order.completed_at).toLocaleString() : ""}
                                            </p>
                                        )}
                                        
                                    </div>
                                    {/* View Details button removed as per request */}
                                    {/* Show Cancel button only for active (not completed) orders */}
                                    {activeTab === 'today' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                                        <button
                                            onClick={() => handleCancelOrder(order.order_id)}
                                            style={{ background: '#fff', color: '#a67b5b', border: '2px solid #a67b5b' }}
                                            className="mt-2 w-full py-2 rounded-lg font-semibold text-lg hover:bg-[#f5f5f5] transition-all duration-200 shadow-md"
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AssignedDeliveries;