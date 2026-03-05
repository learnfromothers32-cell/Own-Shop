import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ARCHITECTURAL CONSTANTS & CONFIGURATION
 * Separating data from view logic is a hallmark of senior architecture.
 */
const STATUS_CONFIG = {
  "Order Placed": { label: "Order Placed", color: "blue", icon: "📦" },
  "Packing": { label: "Packing", color: "purple", icon: "📦" },
  "Shipped": { label: "Shipped", color: "indigo", icon: "🚚" },
  "Out for delivery": { label: "Out for Delivery", color: "orange", icon: "🚚" },
  "Delivered": { label: "Delivered", color: "green", icon: "✅" }
};

const ANIMATIONS = {
  layout: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
  },
  stagger: {
    animate: { transition: { staggerChildren: 0.05 } }
  }
};

/**
 * SUB-COMPONENT: Order Statistics
 */
const OrderStats = ({ orders, formatCurrency }) => {
  const stats = useMemo(() => ({
    total: orders.length,
    revenue: orders.reduce((acc, curr) => acc + (curr.amount || 0), 0),
    pending: orders.filter(o => !o.payment).length,
  }), [orders]);

  const statItems = [
    { label: "Total Revenue", value: formatCurrency(stats.revenue), color: "bg-emerald-500" },
    { label: "Pending Payment", value: stats.pending, color: "bg-amber-500" },
    { label: "Active Orders", value: stats.total, color: "bg-blue-500" },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {statItems.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex-1 min-w-[200px] p-5 bg-white border border-gray-100 rounded-2xl shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className={`w-2 h-2 rounded-full ${stat.color}`} />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</span>
          </div>
          <p className="text-2xl font-light text-gray-900 tabular-nums">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

/**
 * MAIN COMPONENT: Order Management
 */
const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [filter, setFilter] = useState("all");

  // Utilities
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount).replace('$', currency);
  }, []);

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  // Data Orchestration
  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
      if (data.success) setOrders(data.orders.reverse());
    } catch (error) {
      toast.error("Failed to sync orders");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const { data } = await axios.post(`${backendUrl}/api/order/status`, { orderId, status: newStatus }, { headers: { token } });
      if (data.success) {
        toast.success(`Order set to ${newStatus}`);
        await fetchOrders();
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filteredOrders = useMemo(() => 
    filter === "all" ? orders : orders.filter(o => o.status === filter),
  [orders, filter]);

  return (
    <div className="min-h-screen bg-[#FBFBFC] py-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">Operations Dashboard</h4>
            <h1 className="text-4xl font-light text-gray-900 tracking-tight">Executive <span className="font-semibold">Orders</span></h1>
          </div>
          <button 
            onClick={fetchOrders}
            className="px-6 py-2.5 bg-gray-900 text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2"
          >
            Sync Records
          </button>
        </header>

        <OrderStats orders={orders} formatCurrency={formatCurrency} />

        {/* Filter Bar */}
        <div className="flex overflow-x-auto gap-2 mb-8 no-scrollbar">
          {["all", ...Object.keys(STATUS_CONFIG)].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filter === f ? "bg-gray-900 text-white shadow-lg" : "bg-white text-gray-500 border border-gray-100 hover:border-gray-300"
              }`}
            >
              {f === 'all' ? 'Universal View' : f}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-3xl animate-pulse" />)}
            </div>
          ) : (
            <motion.div 
              variants={ANIMATIONS.stagger}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              {filteredOrders.map((order) => (
                <OrderCard 
                  key={order._id}
                  order={order}
                  updating={updatingOrderId === order._id}
                  onStatusUpdate={handleStatusUpdate}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/**
 * SUB-COMPONENT: Individual Order Card
 */
const OrderCard = ({ order, updating, onStatusUpdate, formatCurrency, formatDate }) => {
  const currentStatus = STATUS_CONFIG[order.status] || STATUS_CONFIG["Order Placed"];

  return (
    <motion.div
      variants={ANIMATIONS.layout}
      className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
    >
      <div className="p-8">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          
          {/* Order Identity */}
          <div className="flex gap-6">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500">
              {currentStatus.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ref: {order._id.slice(-8).toUpperCase()}</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{order.address.firstName} {order.address.lastName}</h3>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{formatDate(order.date)}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>{order.items.length} Items</span>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="grid grid-cols-2 gap-8 lg:flex lg:gap-12">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Shipment</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                {order.address.city}, {order.address.country}<br />
                <span className="text-gray-400">{order.address.phone}</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Finance</p>
              <p className="text-lg font-light text-gray-900">{formatCurrency(order.amount)}</p>
              <span className={`text-[10px] font-bold uppercase ${order.payment ? 'text-emerald-500' : 'text-amber-500'}`}>
                {order.payment ? 'Verified' : 'Unpaid'}
              </span>
            </div>
          </div>

          {/* Action Control */}
          <div className="flex items-center">
            <div className="relative w-full lg:w-48">
              <select
                disabled={updating}
                onChange={(e) => onStatusUpdate(order._id, e.target.value)}
                defaultValue={order.status}
                className="w-full appearance-none bg-gray-50 border-none rounded-2xl px-5 py-3 text-xs font-semibold text-gray-700 cursor-pointer focus:ring-2 focus:ring-gray-900/5 transition-all"
              >
                {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {updating && (
                <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Item Preview Bar */}
        <div className="mt-8 pt-6 border-t border-gray-50 flex flex-wrap gap-2">
          {order.items.map((item, idx) => (
            <span key={idx} className="px-3 py-1 bg-gray-50 text-[10px] font-medium text-gray-500 rounded-lg">
              {item.name} <span className="text-gray-300 mx-1">×</span> {item.quantity}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Order;