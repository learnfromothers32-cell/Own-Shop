import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ARCHITECTURAL CONSTANTS
 * Use semantic colors and Lucide-inspired SVG paths for a premium feel.
 */
const STATUS_CONFIG = {
  "Order Placed": {
    label: "Confirmed",
    bg: "bg-blue-50",
    text: "text-blue-600",
    dot: "bg-blue-500",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  Packing: {
    label: "Processing",
    bg: "bg-purple-50",
    text: "text-purple-600",
    dot: "bg-purple-500",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  Shipped: {
    label: "In Transit",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    dot: "bg-indigo-500",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  "Out for delivery": {
    label: "Nearby",
    bg: "bg-orange-50",
    text: "text-orange-600",
    dot: "bg-orange-500",
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
  },
  Delivered: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
    icon: "M5 13l4 4L19 7",
  },
};

const ANIMATIONS = {
  container: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [filter, setFilter] = useState("all");

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    })
      .format(amount)
      .replace("GHS", "₵");
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } },
      );
      if (data.success) setOrders(data.orders.reverse());
    } catch (error) {
      toast.error("Sync failed");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } },
      );
      if (data.success) {
        toast.success("Order updated");
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o,
          ),
        );
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(
    () =>
      filter === "all" ? orders : orders.filter((o) => o.status === filter),
    [orders, filter],
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans selection:bg-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header: Neumorphic subtle depth */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="space-y-1">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 tracking-wider uppercase">
              Admin Portal
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Order{" "}
              <span className="text-slate-400 font-light">Fulfillment</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchOrders}
              className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:border-slate-900 transition-all shadow-sm active:scale-95"
            >
              <svg
                className={`w-4 h-4 ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Data
            </button>
          </div>
        </header>

        <OrderStats orders={orders} formatCurrency={formatCurrency} />

        {/* Filter Chips */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {["all", ...Object.keys(STATUS_CONFIG)].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filter === f
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105"
                  : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
              }`}
            >
              {f === "all" ? "All Orders" : f}
            </button>
          ))}
        </div>

        {/* List Body */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-white rounded-3xl border border-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <motion.div
              variants={ANIMATIONS.container}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 gap-6"
            >
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  updating={updatingOrderId === order._id}
                  onStatusUpdate={handleStatusUpdate}
                  formatCurrency={formatCurrency}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const OrderCard = ({ order, updating, onStatusUpdate, formatCurrency }) => {
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG["Order Placed"];

  return (
    <motion.div
      variants={ANIMATIONS.item}
      className="group bg-white border border-slate-100 rounded-[2rem] p-6 lg:p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Col 1: Status & Brand */}
        <div className="lg:w-1/4 space-y-4">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${config.bg} ${config.text} text-[11px] font-bold uppercase tracking-wider`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`}
            />
            {config.label}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight">
              {order.address.firstName} {order.address.lastName}
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-1">
              #{order._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="pt-2">
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {order.address.street}, {order.address.city}
              <br />
              {order.address.country} • {order.address.phone}
            </p>
          </div>
        </div>

        {/* Col 2: Items Timeline */}
        <div className="flex-1 bg-slate-50/50 rounded-2xl p-5 border border-slate-100/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Package Contents
          </p>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm font-medium"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] shadow-sm">
                    {item.quantity}
                  </span>
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <span className="text-slate-400 tabular-nums">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Financials & Action */}
        <div className="lg:w-1/5 flex flex-col justify-between gap-6">
          <div className="text-right lg:text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Total Value
            </p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {formatCurrency(order.amount)}
            </p>
            <div
              className={`mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${order.payment ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
            >
              {order.payment ? "PAYMENT RECEIVED" : "PENDING SETTLEMENT"}
            </div>
          </div>

          <div className="relative">
            <select
              disabled={updating}
              onChange={(e) => onStatusUpdate(order._id, e.target.value)}
              defaultValue={order.status}
              className="w-full appearance-none bg-slate-900 text-white text-xs font-bold py-3.5 px-5 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors outline-none focus:ring-4 focus:ring-slate-100"
            >
              {Object.keys(STATUS_CONFIG).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {updating && (
              <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center rounded-xl backdrop-blur-sm">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const OrderStats = ({ orders, formatCurrency }) => {
  const stats = useMemo(
    () => ({
      revenue: orders.reduce((acc, curr) => acc + (curr.amount || 0), 0),
      active: orders.filter((o) => o.status !== "Delivered").length,
      success: orders.filter((o) => o.status === "Delivered").length,
    }),
    [orders],
  );

  const cards = [
    {
      label: "Gross Volume",
      value: formatCurrency(stats.revenue),
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Active Pipeline",
      value: stats.active,
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Completed",
      value: stats.success,
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5"
        >
          <div
            className={`w-14 h-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center`}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d={card.icon}
              />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {card.label}
            </p>
            <p className="text-2xl font-black text-slate-900">{card.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Order;
