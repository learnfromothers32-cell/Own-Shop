import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

/* ── Font Injection ───────────────────────────────────────────────── */
const injectFonts = () => {
  if (document.getElementById("order-fonts")) return;
  const link = document.createElement("link");
  link.id = "order-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap";
  document.head.appendChild(link);
};

/* ── Status Config ────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  "Order Placed": {
    label: "Confirmed",
    pill: "bg-sky-50 text-sky-600 ring-1 ring-sky-200",
    dot: "bg-sky-500",
    glow: "shadow-sky-100",
    left: "bg-sky-400",
    progress: 10,
    step: 1,
  },
  Packing: {
    label: "Processing",
    pill: "bg-violet-50 text-violet-600 ring-1 ring-violet-200",
    dot: "bg-violet-500",
    glow: "shadow-violet-100",
    left: "bg-violet-400",
    progress: 30,
    step: 2,
  },
  Shipped: {
    label: "In Transit",
    pill: "bg-blue-50 text-blue-600 ring-1 ring-blue-200",
    dot: "bg-blue-500",
    glow: "shadow-blue-100",
    left: "bg-blue-400",
    progress: 60,
    step: 3,
  },
  "Out for delivery": {
    label: "Nearby",
    pill: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
    dot: "bg-amber-500",
    glow: "shadow-amber-100",
    left: "bg-amber-400",
    progress: 85,
    step: 4,
  },
  Delivered: {
    label: "Delivered",
    pill: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
    glow: "shadow-emerald-100",
    left: "bg-emerald-400",
    progress: 100,
    step: 5,
  },
};

const STEPS = ["Order Placed", "Packing", "Shipped", "Out for delivery", "Delivered"];
const FILTERS = ["All", ...Object.keys(STATUS_CONFIG)];

/* ── Animations ───────────────────────────────────────────────────── */
const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const cardAnim = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, scale: 0.97, transition: { duration: 0.2 } },
};

/* ── Helpers ──────────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" })
    .format(n).replace("GHS", "₵");

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

/* ══════════════════════════════════════════════════════════
   HERO STAT BAR
══════════════════════════════════════════════════════════ */
const HeroStats = ({ stats }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="relative rounded-2xl overflow-hidden mb-8"
    style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)" }}
  >
    {/* grid pattern overlay */}
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
    {/* glow blobs */}
    <div className="absolute top-0 left-1/4 w-64 h-32 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
    <div className="absolute top-0 right-1/4 w-64 h-32 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />

    <div className="relative grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.07]">
      {[
        { label: "Gross Revenue",  value: fmt(stats.revenue),  sub: "All time",          color: "text-emerald-400" },
        { label: "Total Orders",   value: stats.total,         sub: `${stats.active} active`, color: "text-sky-400" },
        { label: "In Pipeline",    value: stats.active,        sub: "Pending delivery",  color: "text-violet-400" },
        { label: "Completed",      value: stats.delivered,     sub: stats.total ? `${Math.round((stats.delivered/stats.total)*100)}% success` : "—", color: "text-amber-400" },
      ].map(({ label, value, sub, color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.5 }}
          className="px-6 py-6 lg:py-8"
        >
          <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/30 mb-3"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {label}
          </p>
          <p className={`text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold leading-none tracking-tight ${color}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {value}
          </p>
          <p className="text-[11px] text-white/30 mt-2 font-medium">{sub}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════
   ORDER PROGRESS STEPS
══════════════════════════════════════════════════════════ */
const ProgressSteps = ({ currentStatus }) => {
  const cfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG["Order Placed"];
  const currentStep = cfg.step;

  return (
    <div className="flex items-center gap-0 w-full">
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const done = stepNum < currentStep;
        const active = stepNum === currentStep;
        const stepCfg = STATUS_CONFIG[step];

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500
                ${done    ? "bg-emerald-500 border-emerald-500" :
                  active  ? `${stepCfg.left} border-transparent shadow-lg ${cfg.glow}` :
                            "bg-white border-slate-200"}`}
              >
                {done ? (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : active ? (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                )}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-1 relative overflow-hidden bg-slate-100">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   ORDER CARD
══════════════════════════════════════════════════════════ */
const OrderCard = ({ order, updating, onStatusUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["Order Placed"];
  const itemCount = order.items?.reduce((s, i) => s + (i.quantity || 1), 0) ?? 0;

  return (
    <motion.div
      variants={cardAnim}
      layout
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.07)] transition-all duration-400"
    >
      {/* ── Colored left accent ── */}
      <div className="flex">
        <div className={`w-1 flex-shrink-0 ${cfg.left} rounded-l-2xl`} />

        <div className="flex-1 min-w-0">

          {/* ── Main row ── */}
          <div className="p-5 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-5 lg:gap-8 items-start">

              {/* COL 1: Identity + progress */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-lg ${cfg.pill}`}
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${order.status !== "Delivered" ? "animate-pulse" : ""}`} />
                        {cfg.label}
                      </span>
                      {order.payment && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          <span className="w-1 h-1 rounded-full bg-emerald-500" /> Paid
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-[16px] leading-tight"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {order.address?.firstName} {order.address?.lastName}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      #{order._id?.slice(-8).toUpperCase()} · {fmtDate(order.date)}
                    </p>
                  </div>

                  {/* Total — visible on mobile */}
                  <div className="lg:hidden text-right">
                    <p className="text-[11px] text-slate-400 font-medium mb-0.5">Total</p>
                    <p className="text-[18px] font-extrabold text-slate-900 tracking-tight"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {fmt(order.amount)}
                    </p>
                  </div>
                </div>

                {/* progress steps */}
                <ProgressSteps currentStatus={order.status} />
              </div>

              {/* COL 2: Total — desktop */}
              <div className="hidden lg:flex flex-col items-end justify-start gap-1 pt-1 min-w-[100px]">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Total
                </p>
                <p className="text-[1.7rem] font-extrabold text-slate-900 tracking-tight leading-none"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {fmt(order.amount)}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
              </div>

              {/* COL 3: Actions */}
              <div className="flex flex-row lg:flex-col items-center lg:items-stretch gap-3 lg:min-w-[148px]">
                {/* status dropdown */}
                <div className="relative flex-1 lg:flex-none">
                  <select
                    disabled={updating}
                    onChange={(e) => onStatusUpdate(order._id, e.target.value)}
                    defaultValue={order.status}
                    className="w-full appearance-none bg-slate-900 text-white text-[11px] font-bold py-2.5 px-4 pr-8 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors outline-none focus:ring-2 focus:ring-slate-900/20"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {Object.keys(STATUS_CONFIG).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {updating && (
                    <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center rounded-xl backdrop-blur-[2px]">
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* expand details */}
                <button
                  onClick={() => setExpanded((p) => !p)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-[11px] font-bold transition-all duration-200 flex-shrink-0
                    ${expanded
                      ? "bg-slate-100 border-slate-200 text-slate-700"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"
                    }`}
                >
                  <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                  Details
                </button>
              </div>
            </div>
          </div>

          {/* ── Expandable details panel ── */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="border-t border-slate-100 mx-5 lg:mx-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 lg:p-6">

                  {/* Items */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-400"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        Package Contents
                      </p>
                      <span className="text-[9px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {/* Item image — small screens only */}
                            {item.image && (
                              <div className="md:hidden w-10 h-10 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex-shrink-0">
                                <img
                                  src={Array.isArray(item.image) ? item.image[0] : item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <span className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm flex-shrink-0"
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                              {item.quantity}
                            </span>
                            <span className="text-[13px] font-medium text-slate-700">
                              {item.name}
                              {item.size && (
                                <span className="ml-1.5 text-[10px] text-slate-400 font-normal">/ {item.size}</span>
                              )}
                            </span>
                          </div>
                          <span className="text-[12px] font-semibold text-slate-600 tabular-nums"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {fmt(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                    {order.paymentMethod && (
                      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}>Via</span>
                        <span className="text-[11px] font-semibold text-slate-600">{order.paymentMethod}</span>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                    <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-3"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      Delivery Address
                    </p>
                    <div className="space-y-1 text-[13px] text-slate-600 leading-relaxed">
                      <p className="font-semibold text-slate-800">
                        {order.address?.firstName} {order.address?.lastName}
                      </p>
                      <p>{order.address?.street}</p>
                      <p>{order.address?.city}{order.address?.state ? `, ${order.address.state}` : ""}</p>
                      <p>{order.address?.country}</p>
                      <p className="font-medium mt-2 pt-2 border-t border-slate-200"
                        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>
                        {order.address?.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   SKELETON
══════════════════════════════════════════════════════════ */
const Skeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden animate-pulse">
    <div className="flex">
      <div className="w-1 bg-slate-100 rounded-l-2xl" />
      <div className="flex-1 p-6 space-y-4">
        <div className="flex gap-3">
          <div className="h-5 w-20 bg-slate-100 rounded-lg" />
          <div className="h-5 w-12 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-4 w-40 bg-slate-100 rounded" />
        <div className="flex gap-2 items-center">
          {[...Array(5)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="w-6 h-6 rounded-full bg-slate-100" />
              {i < 4 && <div className="flex-1 h-px bg-slate-100" />}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="p-6 flex flex-col gap-2 w-40">
        <div className="h-8 w-full bg-slate-100 rounded" />
        <div className="h-10 w-full bg-slate-100 rounded-xl" />
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════ */
const Order = ({ token }) => {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [filter, setFilter]               = useState("All");

  useEffect(() => { injectFonts(); }, []);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
      if (data.success) setOrders(data.orders.reverse());
    } catch { toast.error("Sync failed"); }
    finally { setLoading(false); }
  }, [token]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/status`, { orderId, status: newStatus }, { headers: { token } }
      );
      if (data.success) {
        toast.success("Status updated");
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      }
    } catch { toast.error("Update failed"); }
    finally { setUpdatingOrderId(null); }
  };

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filteredOrders = useMemo(
    () => filter === "All" ? orders : orders.filter((o) => o.status === filter),
    [orders, filter]
  );

  const stats = useMemo(() => ({
    revenue:   orders.reduce((s, o) => s + (o.amount || 0), 0),
    total:     orders.length,
    active:    orders.filter((o) => o.status !== "Delivered").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
  }), [orders]);

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── COMMAND BAR ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-slate-900">Orders</span>
              <span className="text-slate-300">/</span>
              <span className="text-[13px] text-slate-400 font-medium">Fulfillment</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>Live</span>
            </div>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 active:scale-95 transition-all"
            >
              <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

        {/* ── PAGE TITLE ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className="mb-6"
        >
          <h1 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold text-slate-900 tracking-tight leading-none">
            Order Fulfillment
          </h1>
          <p className="text-[13px] text-slate-400 mt-1.5 font-medium">
            {orders.length} total orders · {stats.active} active · {stats.delivered} delivered
          </p>
        </motion.div>

        {/* ── HERO STATS ── */}
        <HeroStats stats={stats} />

        {/* ── FILTER TABS ── */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {FILTERS.map((f) => {
            const count = f === "All" ? orders.length : orders.filter((o) => o.status === f).length;
            const cfg = f !== "All" ? STATUS_CONFIG[f] : null;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap
                  ${filter === f
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
              >
                {cfg && filter === f && (
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                )}
                {f === "All" ? "All Orders" : f}
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md
                  ${filter === f ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── ORDER LIST ── */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <Skeleton key={i} />)}
            </div>
          ) : filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-[13px] font-semibold text-slate-400">No orders found</p>
              <p className="text-[11px] text-slate-300">Try a different filter</p>
            </motion.div>
          ) : (
            <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  updating={updatingOrderId === order._id}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Order;