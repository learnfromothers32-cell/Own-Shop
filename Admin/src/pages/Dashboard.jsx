import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { motion, AnimatePresence } from "framer-motion";

/* ── Font Injection ───────────────────────────────────────────────── */
const injectFonts = () => {
  if (document.getElementById("dash-fonts")) return;
  const link = document.createElement("link");
  link.id = "dash-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap";
  document.head.appendChild(link);
};

/* ── Helpers ──────────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" })
    .format(n)
    .replace("GHS", "₵");

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/* ── Animations ───────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] },
  }),
};

const PAYMENT_CONFIG = {
  MTN: {
    bar: "bg-amber-400",
    pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  Stripe: {
    bar: "bg-blue-500",
    pill: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  },
  COD: {
    bar: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
};

const STATUS_CONFIG = {
  "Order Placed": {
    pill: "bg-sky-50 text-sky-600 ring-1 ring-sky-200",
    dot: "bg-sky-500",
    left: "bg-sky-400",
  },
  Packing: {
    pill: "bg-violet-50 text-violet-600 ring-1 ring-violet-200",
    dot: "bg-violet-500",
    left: "bg-violet-400",
  },
  Shipped: {
    pill: "bg-blue-50 text-blue-600 ring-1 ring-blue-200",
    dot: "bg-blue-500",
    left: "bg-blue-400",
  },
  "Out for delivery": {
    pill: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
    dot: "bg-amber-500",
    left: "bg-amber-400",
  },
  Delivered: {
    pill: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
    left: "bg-emerald-400",
  },
  Pending: {
    pill: "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
    dot: "bg-slate-400",
    left: "bg-slate-300",
  },
  Processing: {
    pill: "bg-violet-50 text-violet-600 ring-1 ring-violet-200",
    dot: "bg-violet-500",
    left: "bg-violet-400",
  },
};
const getStatusCfg = (s) => STATUS_CONFIG[s] || STATUS_CONFIG["Pending"];

/* ══════════════════════════════════════════════════════════
   HERO STATS — Enhanced Responsive Grid
══════════════════════════════════════════════════════════ */
const HeroStats = ({ stats, timeframe, setTimeframe }) => (
  <motion.div
    custom={0}
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    className="relative rounded-2xl overflow-hidden mb-8 shadow-xl shadow-slate-200/50"
    style={{
      background:
        "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
    }}
  >
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />

    {/* Header: Responsive stack on mobile */}
    <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-5 gap-4 border-b border-white/[0.06]">
      <p
        className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/30"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        Overview
      </p>
      <div className="flex items-center gap-1 p-1 bg-white/[0.06] rounded-xl w-full sm:w-auto">
        {["day", "week", "month"].map((p) => (
          <button
            key={p}
            onClick={() => setTimeframe(p)}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all duration-200
              ${timeframe === p ? "bg-white/15 text-white" : "text-white/25 hover:text-white/50"}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>

    {/* Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
    <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.07]">
      {[
        {
          label: "Total Revenue",
          value: fmt(stats.totalSales),
          sub: `${stats.totalOrders} orders`,
          color: "text-emerald-400",
        },
        {
          label: "Products",
          value: stats.totalProducts,
          sub: "In inventory",
          color: "text-sky-400",
        },
        {
          label: "Customers",
          value: stats.totalUsers,
          sub: "Registered users",
          color: "text-violet-400",
        },
        {
          label: "MTN MoMo",
          value: fmt(stats.mtnSales),
          sub: "Mobile money",
          color: "text-amber-400",
        },
      ].map(({ label, value, sub, color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
          className="px-6 py-6 sm:py-7"
        >
          <p
            className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/25 mb-3"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {label}
          </p>
          <p
            className={`text-[clamp(1.25rem,5vw,2rem)] font-extrabold leading-none tracking-tight ${color}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {value}
          </p>
          <p className="text-[11px] text-white/25 mt-2 font-medium">{sub}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════
   REMAINING COMPONENTS (Cards & Main)
══════════════════════════════════════════════════════════ */

const PaymentCard = ({ stats }) => {
  const total = stats.totalSales || 1;
  const rows = [
    { label: "MTN Mobile Money", value: stats.mtnSales, key: "MTN" },
    { label: "Stripe", value: stats.stripeSales, key: "Stripe" },
    { label: "Cash on Delivery", value: stats.codSales, key: "COD" },
  ];

  return (
    <motion.div
      custom={0.15}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 via-blue-500 to-emerald-500" />
      <div className="p-6">
        <div className="mb-6">
          <p
            className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-400"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Payment Breakdown
          </p>
          <p
            className="text-[15px] font-extrabold text-slate-900 mt-1"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Revenue by method
          </p>
        </div>
        <div className="space-y-5">
          {rows.map(({ label, value, key }, i) => {
            const pct = ((value / total) * 100).toFixed(1);
            const cfg = PAYMENT_CONFIG[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-2 gap-2">
                  <span
                    className="text-[12px] font-semibold text-slate-700 truncate"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {label}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[13px] font-extrabold text-slate-900 tabular-nums">
                      {fmt(value)}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${cfg.pill}`}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${cfg.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, delay: 0.3 + i * 0.08 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const OrderStatusCard = ({ stats }) => {
  const rows = [
    { label: "Confirmed", count: stats.pendingOrders, status: "Order Placed" },
    { label: "Processing", count: stats.processingOrders, status: "Packing" },
    { label: "In Transit", count: stats.shippedOrders, status: "Shipped" },
    { label: "Delivered", count: stats.deliveredOrders, status: "Delivered" },
  ];
  const grandTotal = rows.reduce((s, r) => s + (r.count || 0), 0) || 1;

  return (
    <motion.div
      custom={0.2}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500" />
      <div className="p-6">
        <div className="mb-6">
          <p
            className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-400"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Order Pipeline
          </p>
          <p
            className="text-[15px] font-extrabold text-slate-900 mt-1"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Status breakdown
          </p>
        </div>
        <div className="space-y-3">
          {rows.map(({ label, count, status }, i) => {
            const cfg = getStatusCfg(status);
            const pct = Math.round(((count || 0) / grandTotal) * 100);
            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
                className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50"
              >
                <div
                  className={`w-[3px] h-8 rounded-full flex-shrink-0 ${cfg.left}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-md ${cfg.pill} truncate`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {label}
                    </span>
                    <span className="text-[15px] font-extrabold text-slate-900">
                      {count ?? 0}
                    </span>
                  </div>
                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${cfg.left}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const RecentOrdersCard = ({ orders }) => (
  <motion.div
    custom={0.25}
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    className="relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm"
  >
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500" />
    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 gap-4">
      <div className="min-w-0">
        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-400">
          Recent Activity
        </p>
        <p className="text-[15px] font-extrabold text-slate-900 mt-0.5 truncate">
          Latest Orders
        </p>
      </div>
      <button className="flex-shrink-0 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg border border-slate-200">
        View All
      </button>
    </div>

    {/* Desktop Table */}
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60">
            {[
              "Order ID",
              "Customer",
              "Amount",
              "Payment",
              "Status",
              "Date",
            ].map((h) => (
              <th
                key={h}
                className="text-left py-3 px-5 text-[9px] font-bold tracking-[0.2em] uppercase text-slate-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order, i) => {
            const sCfg = getStatusCfg(order.status);
            const pMethod = order.paymentMethod?.includes("MTN")
              ? "MTN"
              : order.paymentMethod?.includes("Stripe")
                ? "Stripe"
                : "COD";
            const pCfg = PAYMENT_CONFIG[pMethod];
            return (
              <tr
                key={order._id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                <td className="py-4 px-5 font-mono text-[11px] font-bold text-slate-500">
                  #{order._id?.slice(-8).toUpperCase()}
                </td>
                <td className="py-4 px-5 text-[13px] font-semibold text-slate-900">
                  {order.address?.firstName} {order.address?.lastName}
                </td>
                <td className="py-4 px-5 text-[14px] font-extrabold text-slate-900">
                  {fmt(order.amount)}
                </td>
                <td className="py-4 px-5">
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-1 rounded-md ${pCfg.pill}`}
                  >
                    {pMethod}
                  </span>
                </td>
                <td className="py-4 px-5">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase px-2 py-1 rounded-md ${sCfg.pill}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />
                    {order.status || "Pending"}
                  </span>
                </td>
                <td className="py-4 px-5 text-[11px] text-slate-400 font-mono">
                  {fmtDate(order.date)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {/* Mobile List */}
    <div className="md:hidden divide-y divide-slate-100">
      {orders.map((order, i) => {
        const sCfg = getStatusCfg(order.status);
        const pMethod = order.paymentMethod?.includes("MTN") ? "MTN" : "COD";
        const pCfg = PAYMENT_CONFIG[pMethod];
        return (
          <div key={order._id} className="flex flex-col p-5 gap-3">
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-slate-900 truncate">
                  {order.address?.firstName} {order.address?.lastName}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  #{order._id?.slice(-8).toUpperCase()}
                </p>
              </div>
              <p className="text-[14px] font-extrabold text-slate-900">
                {fmt(order.amount)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${pCfg.pill}`}
              >
                {pMethod}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md ${sCfg.pill}`}
              >
                <span className={`w-1 h-1 rounded-full ${sCfg.dot}`} />
                {order.status || "Pending"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </motion.div>
);

const Skeleton = () => (
  <div className="min-h-screen bg-[#F7F8FA] animate-pulse">
    <div className="bg-white border-b border-slate-200 h-14" />
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 space-y-6">
      <div className="h-8 w-48 bg-slate-100 rounded-xl" />
      <div className="h-48 bg-slate-100 rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-64 bg-slate-100 rounded-2xl" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
      <div className="h-80 bg-slate-100 rounded-2xl" />
    </div>
  </div>
);

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    mtnSales: 0,
    stripeSales: 0,
    codSales: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("week");

  useEffect(() => {
    injectFonts();
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/admin/stats?timeframe=${timeframe}`,
        { headers: { token } },
      );
      if (data.success) setStats(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [token, timeframe]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) return <Skeleton />;

  return (
    <div
      className="min-h-screen bg-[#F7F8FA]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Responsive Command Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex-shrink-0 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[13px]">
              <span className="font-bold text-slate-900">Dashboard</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-400 font-medium">Overview</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchStats}
              className="px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h1 className="text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold text-slate-900 tracking-tight leading-none">
            Dashboard Overview
          </h1>
          <p className="text-[13px] text-slate-400 mt-2 font-medium">
            Monitoring your store performance in real-time.
          </p>
        </motion.div>

        <HeroStats
          stats={stats}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PaymentCard stats={stats} />
          <OrderStatusCard stats={stats} />
        </div>
        <RecentOrdersCard orders={stats.recentOrders} />
      </div>
    </div>
  );
};

export default Dashboard;
 