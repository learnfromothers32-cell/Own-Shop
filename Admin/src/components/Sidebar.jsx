import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ── Font Injection ───────────────────────────────────────────────── */
const injectFonts = () => {
  if (document.getElementById("sidebar-fonts")) return;
  const link = document.createElement("link");
  link.id = "sidebar-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap";
  document.head.appendChild(link);
};

/* ── Nav Items ────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    short: "Home",
    accent: "bg-indigo-500",
    glowColor: "rgba(99,102,241,0.15)",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    ),
  },
  {
    to: "/add",
    label: "Add Items",
    short: "Add",
    accent: "bg-violet-500",
    glowColor: "rgba(139,92,246,0.15)",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    to: "/list",
    label: "List Items",
    short: "List",
    accent: "bg-blue-500",
    glowColor: "rgba(59,130,246,0.15)",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    ),
  },
  {
    to: "/orders",
    label: "Orders",
    short: "Orders",
    accent: "bg-emerald-500",
    glowColor: "rgba(16,185,129,0.15)",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.375c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    ),
  },
];

/* ── Animations ───────────────────────────────────────────────────── */
const sidebarAnim = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};
const listAnim = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const itemAnim = {
  hidden: { opacity: 0, x: -14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ════════════════════════════════════════════════════════════════════
   SIDEBAR
════════════════════════════════════════════════════════════════════ */
function Sidebar() {
  useEffect(() => {
    injectFonts();
  }, []);

  return (
    <motion.aside
      variants={sidebarAnim}
      initial="hidden"
      animate="visible"
      className="w-[72px] md:w-[220px] min-h-screen flex flex-col bg-[#0f172a] border-r border-white/[0.06]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── LOGO AREA ── */}
      <div className="h-14 flex items-center px-4 md:px-5 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* icon mark */}
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          {/* wordmark */}
          <div className="hidden md:flex flex-col leading-none">
            <span className="text-[13px] font-extrabold text-white tracking-tight">
              Admin
            </span>
            <span
              className="text-[9px] font-bold text-white/30 tracking-[0.2em] uppercase mt-0.5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* ── NAV LABEL ── */}
      <div className="hidden md:flex items-center gap-2.5 px-5 pt-6 pb-3">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span
          className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/20 flex-shrink-0"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Menu
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>
      <div className="md:hidden pt-5" />

      {/* ── NAV ITEMS ── */}
      <motion.nav
        variants={listAnim}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-1 px-3 flex-1"
      >
        {NAV_ITEMS.map(({ to, label, short, accent, glowColor, icon }) => (
          <motion.div key={to} variants={itemAnim}>
            <NavLink to={to}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{
                    x: isActive ? 0 : 3,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer overflow-hidden transition-colors duration-200"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${glowColor}, rgba(255,255,255,0.04))`
                      : "transparent",
                  }}
                >
                  {/* Active: colored left bar */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-accent"
                        className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full ${accent}`}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon container */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
                    ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "bg-transparent text-white/25 group-hover:text-white/50"
                    }`}
                  >
                    {icon}
                  </div>

                  {/* Label */}
                  <span
                    className={`hidden md:block text-[12px] font-semibold tracking-wide transition-colors duration-200 truncate
                    ${isActive ? "text-white" : "text-white/35 hover:text-white/60"}`}
                  >
                    {label}
                  </span>

                  {/* Active dot indicator (mobile) */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-dot"
                      className={`md:hidden absolute right-2 w-1.5 h-1.5 rounded-full ${accent}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      }}
                    />
                  )}

                  {/* Chevron (desktop, active) */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        transition={{ duration: 0.2 }}
                        className="hidden md:flex ml-auto flex-shrink-0"
                      >
                        <svg
                          className="w-3 h-3 text-white/30"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </NavLink>
          </motion.div>
        ))}
      </motion.nav>

      {/* ── FOOTER ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="px-3 py-5 border-t border-white/[0.06]"
      >
        {/* status pill */}
        <div className="flex items-center justify-center md:justify-start gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span
            className="hidden md:block text-[9px] font-bold tracking-[0.2em] uppercase text-white/25"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            System Online
          </span>
        </div>

        {/* version */}
        <p
          className="hidden md:block text-center text-[9px] font-bold tracking-[0.2em] uppercase text-white/10 mt-3"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Admin v1.0
        </p>
      </motion.div>
    </motion.aside>
  );
}

export default Sidebar;