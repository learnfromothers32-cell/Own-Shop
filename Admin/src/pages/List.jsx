import React, { useEffect, useState, useMemo, useCallback } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

/* ── Font Injection ───────────────────────────────────────────────── */
const injectFonts = () => {
  if (document.getElementById("list-fonts")) return;
  const link = document.createElement("link");
  link.id = "list-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap";
  document.head.appendChild(link);
};

/* ── Category config ──────────────────────────────────────────────── */
const CAT_CONFIG = {
  Men:     { pill: "bg-blue-50   text-blue-600   ring-1 ring-blue-200",   dot: "bg-blue-500",   left: "bg-blue-400",   glow: "rgba(59,130,246,0.06)"  },
  Women:   { pill: "bg-pink-50   text-pink-600   ring-1 ring-pink-200",   dot: "bg-pink-500",   left: "bg-pink-400",   glow: "rgba(236,72,153,0.06)"  },
  Kids:    { pill: "bg-amber-50  text-amber-600  ring-1 ring-amber-200",  dot: "bg-amber-500",  left: "bg-amber-400",  glow: "rgba(245,158,11,0.06)"  },
  Unisex:  { pill: "bg-violet-50 text-violet-600 ring-1 ring-violet-200", dot: "bg-violet-500", left: "bg-violet-400", glow: "rgba(139,92,246,0.06)"  },
  default: { pill: "bg-slate-50  text-slate-600  ring-1 ring-slate-200",  dot: "bg-slate-400",  left: "bg-slate-300",  glow: "rgba(100,116,139,0.04)" },
};
const cat = (c) => CAT_CONFIG[c] || CAT_CONFIG.default;

/* ── Animations ───────────────────────────────────────────────────── */
const stagger = { animate: { transition: { staggerChildren: 0.05 } } };
const itemAnim = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

/* ══════════════════════════════════════════════════════════
   DARK HERO STATS (mirrors Order.jsx)
══════════════════════════════════════════════════════════ */
const HeroStats = ({ total, showing, categories, totalValue }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="relative rounded-2xl overflow-hidden mb-8"
    style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)" }}
  >
    {/* grid overlay */}
    <div className="absolute inset-0 opacity-[0.04]" style={{
      backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
      backgroundSize: "32px 32px",
    }} />
    {/* glow blobs */}
    <div className="absolute top-0 left-1/4 w-64 h-32 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
    <div className="absolute top-0 right-1/4 w-64 h-32 bg-violet-500/10 rounded-full blur-[60px] pointer-events-none" />

    <div className="relative grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.07]">
      {[
        { label: "Total Products",   value: total,                            color: "text-sky-400"     },
        { label: "Currently Showing", value: showing,                          color: "text-violet-400"  },
        { label: "Categories",       value: categories,                        color: "text-amber-400"   },
        { label: "Inventory Value",  value: `₵${totalValue.toLocaleString()}`, color: "text-emerald-400" },
      ].map(({ label, value, color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.5 }}
          className="px-6 py-6 lg:py-8"
        >
          <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/30 mb-3"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {label}
          </p>
          <p className={`text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold leading-none tracking-tight ${color}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {value}
          </p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════
   DESKTOP TABLE ROW
══════════════════════════════════════════════════════════ */
const ProductRow = ({ item, isRemoving, onRemove }) => {
  const cfg = cat(item.category);
  return (
    <motion.div
      variants={itemAnim} layout
      className="group flex overflow-hidden border-b border-slate-100 last:border-0 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300"
    >
      {/* colored left bar */}
      <div className={`w-[3px] flex-shrink-0 ${cfg.left} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="flex-1 grid grid-cols-[56px_1fr_110px_90px_44px] items-center gap-5 px-5 py-4"
        style={{ background: `linear-gradient(to right, ${cfg.glow}, transparent 30%)` }}>

        {/* image */}
        <div className="relative w-14 h-14 rounded-xl border border-slate-200/80 overflow-hidden bg-slate-50 flex-shrink-0">
          <img
            src={Array.isArray(item.image) ? item.image[0] : item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* name + id + sizes */}
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-slate-900 truncate leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {item.name}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            #{item._id.slice(-8).toUpperCase()}
          </p>
          {item.sizes?.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {item.sizes.slice(0, 5).map((s) => (
                <span key={s} className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s}</span>
              ))}
              {item.sizes.length > 5 && (
                <span className="text-[9px] text-slate-400 font-bold">+{item.sizes.length - 5}</span>
              )}
            </div>
          )}
        </div>

        {/* category */}
        <span className={`inline-flex text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-lg ${cfg.pill}`}
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {item.category}
        </span>

        {/* price */}
        <p className="text-[14px] font-extrabold text-slate-900 tabular-nums"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          ₵{item.price.toLocaleString()}
        </p>

        {/* delete */}
        <button
          onClick={() => onRemove(item._id, item.name)}
          disabled={isRemoving}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-300 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all duration-200 disabled:opacity-40"
        >
          {isRemoving ? (
            <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          )}
        </button>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   GRID CARD (new view mode)
══════════════════════════════════════════════════════════ */
const ProductGridCard = ({ item, isRemoving, onRemove }) => {
  const cfg = cat(item.category);
  return (
    <motion.div
      variants={itemAnim} layout
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:border-slate-300 transition-all duration-300"
    >
      {/* image */}
      <div className="relative w-full aspect-square overflow-hidden bg-slate-50">
        <img
          src={Array.isArray(item.image) ? item.image[0] : item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        {/* delete button — floats on image */}
        <button
          onClick={() => onRemove(item._id, item.name)}
          disabled={isRemoving}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm border border-white/50 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all duration-200 disabled:opacity-40"
        >
          {isRemoving ? (
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
        {/* category badge on image */}
        <div className="absolute bottom-3 left-3">
          <span className={`inline-flex text-[9px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-lg backdrop-blur-sm ${cfg.pill} bg-white/90`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {item.category}
          </span>
        </div>
      </div>

      {/* info */}
      <div className="p-4">
        <h3 className="text-[13px] font-semibold text-slate-900 leading-snug line-clamp-1"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {item.name}
        </h3>
        <p className="text-[10px] text-slate-400 mt-0.5"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          #{item._id.slice(-8).toUpperCase()}
        </p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-[16px] font-extrabold text-slate-900"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            ₵{item.price.toLocaleString()}
          </p>
          {item.sizes?.length > 0 && (
            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {item.sizes.length} sizes
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   MOBILE CARD
══════════════════════════════════════════════════════════ */
const MobileCard = ({ item, isRemoving, onRemove }) => {
  const cfg = cat(item.category);
  return (
    <motion.div variants={itemAnim} layout
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300">
      <div className="flex">
        <div className={`w-1 flex-shrink-0 ${cfg.left}`} />
        <div className="flex-1 p-4 flex gap-4">
          <div className="w-16 h-16 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 flex-shrink-0">
            <img src={Array.isArray(item.image) ? item.image[0] : item.image} alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-[13px] font-semibold text-slate-900 truncate"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.name}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  #{item._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <button onClick={() => onRemove(item._id, item.name)} disabled={isRemoving}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-300 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all flex-shrink-0 disabled:opacity-40">
                {isRemoving
                  ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  : <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                }
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex text-[9px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-md ${cfg.pill}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>{item.category}</span>
              <span className="text-[13px] font-extrabold text-slate-900"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                ₵{item.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Skeleton ─────────────────────────────────────────────────────── */
const TableSkeleton = () => (
  <div className="px-6 py-5 grid grid-cols-[56px_1fr_110px_90px_44px] items-center gap-5 animate-pulse border-b border-slate-100 last:border-0">
    <div className="w-14 h-14 rounded-xl bg-slate-100" />
    <div className="space-y-2"><div className="h-3.5 bg-slate-100 rounded w-2/5" /><div className="h-2.5 bg-slate-50 rounded w-1/4" /></div>
    <div className="h-5 bg-slate-100 rounded-lg w-16" />
    <div className="h-4 bg-slate-100 rounded w-14" />
    <div className="w-8 h-8 bg-slate-100 rounded-lg" />
  </div>
);

const GridSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden animate-pulse">
    <div className="aspect-square bg-slate-100" />
    <div className="p-4 space-y-2">
      <div className="h-3.5 bg-slate-100 rounded w-3/4" />
      <div className="h-2.5 bg-slate-50 rounded w-1/3" />
      <div className="h-5 bg-slate-100 rounded w-1/2 mt-3" />
    </div>
  </div>
);

/* ── Empty State ──────────────────────────────────────────────────── */
const EmptyState = ({ hasQuery }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
      <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.375c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    </div>
    <p className="text-[13px] font-semibold text-slate-400"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {hasQuery ? "No products match your search" : "No products yet"}
    </p>
    <p className="text-[11px] text-slate-300">{hasQuery ? "Try a different keyword" : "Add your first product to get started"}</p>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════ */
const List = ({ token }) => {
  const [list, setList]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [removingId, setRemovingId]   = useState(null);
  const [search, setSearch]           = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode]       = useState("list"); // "list" | "grid"

  useEffect(() => { injectFonts(); }, []);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/list`);
      if (data.success) setList(data.products);
      else toast.error(data.message);
    } catch { toast.error("Failed to sync inventory"); }
    finally { setLoading(false); }
  }, []);

  const removeProduct = async (id, name) => {
    if (!window.confirm(`Permanently remove "${name}"?`)) return;
    setRemovingId(id);
    try {
      const { data } = await axios.post(`${backendUrl}/api/product/remove`, { id }, { headers: { token } });
      if (data.success) { toast.success("Product removed"); setList((p) => p.filter((x) => x._id !== id)); }
    } catch { toast.error("Operation failed"); }
    finally { setRemovingId(null); }
  };

  useEffect(() => { fetchList(); }, [fetchList]);

  const categories = useMemo(() => ["All", ...new Set(list.map((p) => p.category))], [list]);

  const filteredList = useMemo(() => list.filter((p) => {
    const q = search.toLowerCase();
    return (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      && (activeFilter === "All" || p.category === activeFilter);
  }), [list, search, activeFilter]);

  const totalValue = useMemo(() => list.reduce((s, p) => s + (p.price || 0), 0), [list]);

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── COMMAND BAR ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.375c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-slate-900">Products</span>
              <span className="text-slate-300">/</span>
              <span className="text-[13px] text-slate-400 font-medium">Catalog</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* view toggle */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {[
                { mode: "list", icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></> },
                { mode: "grid", icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></> },
              ].map(({ mode, icon }) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md transition-all duration-200
                    ${viewMode === mode ? "bg-white shadow-sm text-slate-700" : "text-slate-400 hover:text-slate-600"}`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{icon}</svg>
                </button>
              ))}
            </div>

            {/* search */}
            <div className="relative hidden sm:block">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search products..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-52 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
            </div>

            <button onClick={fetchList}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 active:scale-95 transition-all">
              <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">

        {/* ── PAGE TITLE ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
          <h1 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold text-slate-900 tracking-tight leading-none">
            Product Catalog
          </h1>
          <p className="text-[13px] text-slate-400 mt-1.5 font-medium">
            {list.length} products · ₵{totalValue.toLocaleString()} total inventory value
          </p>
        </motion.div>

        {/* ── HERO STATS ── */}
        <HeroStats
          total={list.length}
          showing={filteredList.length}
          categories={categories.length - 1}
          totalValue={totalValue}
        />

        {/* ── MOBILE SEARCH ── */}
        <div className="sm:hidden mb-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search products..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[12px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all" />
          </div>
        </div>

        {/* ── CATEGORY FILTERS ── */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-5 no-scrollbar">
          {categories.map((c) => {
            const count = c === "All" ? list.length : list.filter((p) => p.category === c).length;
            const cfg = c !== "All" ? cat(c) : null;
            return (
              <button key={c} onClick={() => setActiveFilter(c)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap
                  ${activeFilter === c ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"}`}>
                {cfg && activeFilter === c && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                {c}
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md
                  ${activeFilter === c ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── DESKTOP TABLE VIEW ── */}
        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
              {/* header */}
              <div className="grid grid-cols-[56px_1fr_110px_90px_44px] gap-5 px-6 py-3.5 border-b border-slate-100 bg-slate-50/60">
                {["Preview", "Product", "Category", "Price", ""].map((h, i) => (
                  <span key={i} className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-400"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>{h}</span>
                ))}
              </div>
              <AnimatePresence mode="popLayout">
                {loading ? <div>{[...Array(5)].map((_, i) => <TableSkeleton key={i} />)}</div>
                : filteredList.length > 0
                  ? <motion.div variants={stagger} initial="initial" animate="animate">
                      {filteredList.map((item) => (
                        <ProductRow key={item._id} item={item} isRemoving={removingId === item._id} onRemove={removeProduct} />
                      ))}
                    </motion.div>
                  : <EmptyState hasQuery={!!search} />}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block">
              <AnimatePresence mode="popLayout">
                {loading
                  ? <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {[...Array(8)].map((_, i) => <GridSkeleton key={i} />)}
                    </div>
                  : filteredList.length > 0
                    ? <motion.div variants={stagger} initial="initial" animate="animate"
                        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredList.map((item) => (
                          <ProductGridCard key={item._id} item={item} isRemoving={removingId === item._id} onRemove={removeProduct} />
                        ))}
                      </motion.div>
                    : <EmptyState hasQuery={!!search} />}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MOBILE CARDS ── */}
        <div className="md:hidden">
          <AnimatePresence mode="popLayout">
            {loading
              ? <div className="space-y-3">{[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 flex gap-4 animate-pulse">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 flex-shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3.5 bg-slate-100 rounded w-3/5" />
                      <div className="h-2.5 bg-slate-50 rounded w-2/5" />
                      <div className="h-4 bg-slate-100 rounded-lg w-1/3 mt-2" />
                    </div>
                  </div>
                ))}</div>
              : filteredList.length > 0
                ? <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3">
                    {filteredList.map((item) => (
                      <MobileCard key={item._id} item={item} isRemoving={removingId === item._id} onRemove={removeProduct} />
                    ))}
                  </motion.div>
                : <EmptyState hasQuery={!!search} />}
          </AnimatePresence>
        </div>

        {/* ── FOOTER ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {filteredList.length} of {list.length} products
            </span>
            {search && (
              <button onClick={() => setSearch("")}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors">
                Clear search
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>System Secure</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default List;