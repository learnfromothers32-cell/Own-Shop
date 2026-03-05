import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

/* ── Inline icons (replaces asset images for nav items) ── */
const Icons = {
  add: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  list: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  orders: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.375c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
};

const NAV_ITEMS = [
  { to: "/add",    label: "Add Items",  icon: Icons.add    },
  { to: "/list",   label: "List Items", icon: Icons.list   },
  { to: "/orders", label: "Orders",     icon: Icons.orders },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden:  { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.33, 1, 0.68, 1] } },
};

function Sidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
      className="w-[18%] min-h-screen border-r border-gray-100 bg-white flex flex-col"
    >

      {/* ── Section label ── */}
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="h-[1.5px] w-6 bg-[#414141] shrink-0" />
          <span className="hidden md:block text-[9px] font-bold tracking-[0.3em] uppercase text-gray-400">
            Navigate
          </span>
        </div>
      </div>

      {/* ── Nav links ── */}
      <motion.nav
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-1 px-3 flex-1"
      >
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <motion.div key={to} variants={itemVariants}>
            <NavLink to={to}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 3, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group
                    ${isActive
                      ? "bg-gray-50 border border-gray-100 text-[#1a1a1a]"
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-50/70 border border-transparent"
                    }`}
                >
                  {/* Active top-accent line */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-accent"
                      className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#1a1a1a] rounded-t-xl"
                    />
                  )}

                  {/* Icon */}
                  <span className={`transition-colors duration-200 ${isActive ? "text-[#1a1a1a]" : "text-gray-300 group-hover:text-gray-500"}`}>
                    {icon}
                  </span>

                  {/* Label */}
                  <span className={`hidden md:block text-xs font-semibold tracking-wide transition-colors duration-200 ${isActive ? "text-[#1a1a1a]" : ""}`}>
                    {label}
                  </span>

                  {/* Active dot (mobile) */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-dot"
                      className="md:hidden absolute right-2.5 w-1.5 h-1.5 rounded-full bg-[#1a1a1a]"
                    />
                  )}

                  {/* Active count pill placeholder (desktop) */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-[#1a1a1a]"
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          </motion.div>
        ))}
      </motion.nav>

      {/* ── Footer ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="px-5 py-6 border-t border-gray-100"
      >
        <p className="hidden md:block text-[9px] font-semibold tracking-[0.25em] uppercase text-gray-300 text-center">
          Admin v1.0
        </p>
      </motion.div>

    </motion.aside>
  );
}

export default Sidebar;