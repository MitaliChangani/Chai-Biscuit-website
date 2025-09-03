import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const statusColor = {
  delivered: 'text-green-600',
  cancelled: 'text-red-500',
  pending: 'text-yellow-600',
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  // Normalize backend → UI shape safely
  const normalizeOrder = (o) => {
    const rawStatus = (o?.status ?? o?.delivery_status ?? '').toString().toLowerCase();
    const items = Array.isArray(o?.items) ? o.items : [];

    return {
      order_id: o?.order_id ?? o?.id ?? o?.uuid ?? 'N/A',
      date:
        o?.date ??
        o?.placed_at ??
        o?.created_at ??
        '',
      status: rawStatus, // delivered/cancelled/pending
      items: items.map((it) => ({
        item_name: it?.item_name ?? it?.name ?? 'Item',
        quantity: Number(it?.quantity ?? 0),
        price_per_item: Number(it?.price_per_item ?? it?.price ?? 0),
      })),
      total_amount: Number(o?.total_amount ?? o?.total ?? 0),
    };
  };

  useEffect(() => {
    const load = async () => {
      const phone = localStorage.getItem('phone_number');

      if (!phone) {
        setErrMsg('No phone number found. Please sign in again.');
        setLoading(false);
        return;
      }

      try {
        const url = `http://localhost:8000/api/order-history/?phone=${encodeURIComponent(
          phone
        )}`;

        const res = await fetch(url, { credentials: 'include' });

        // Read text first to provide a helpful error if the server returns HTML or non-JSON
        const text = await res.text();
        if (!res.ok) {
          throw new Error(
            `API error ${res.status}. Response: ${text.slice(0, 200)}`
          );
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            'Server did not return JSON. Check your API (maybe it returned an HTML error page).'
          );
        }

        if (!Array.isArray(data)) {
          throw new Error('Unexpected API response: expected an array of orders.');
        }

        // Keep only delivered orders (case-insensitive)
        const delivered = data
          .map(normalizeOrder)
          .filter((o) => o.status === 'delivered');

        setOrders(delivered);
      } catch (e) {
        setErrMsg(e.message || 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#fef6f3] p-4 sm:p-6 md:p-10">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-[#4b2c20] mb-6">
            Order History
          </h1>

          {loading && (
            <p className="text-center text-gray-500">Loading delivered orders…</p>
          )}

          {!loading && errMsg && (
            <div className="text-center text-red-600">
              {errMsg}
            </div>
          )}

          {!loading && !errMsg && orders.length === 0 && (
            <p className="text-center text-gray-500">No delivered orders found.</p>
          )}

          {!loading && !errMsg && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <div
                  key={order.order_id || index}
                  className="border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm bg-[#fffaf8]"
                >
                  <div className="flex justify-between items-center flex-wrap gap-y-2">
                    <div>
                      <h2 className="font-semibold text-[#4b2c20] text-md">
                        Order ID: {order.order_id}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {order.date ? String(order.date) : ''}
                      </p>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        statusColor[order.status] || 'text-gray-600'
                      }`}
                    >
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Delivered'}
                    </div>
                  </div>

                  <ul className="mt-3 text-sm text-gray-700 list-disc pl-5">
                    {(order.items ?? []).map((item, i) => (
                      <li key={i}>
                        {item.quantity}x {item.item_name}
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-between items-center mt-4">
                    <p className="font-semibold text-[#4b2c20]">
                      Total: ₹
                      {Number.isFinite(order.total_amount)
                        ? order.total_amount.toFixed(2)
                        : '0.00'}
                    </p>
                    <button className="text-sm text-[#4b2c20] border border-[#4b2c20] px-3 py-1 rounded-full hover:bg-[#f3e7e3] transition">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderHistory;
