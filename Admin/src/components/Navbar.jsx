import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Icons = {
  logout: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  ),
  shield: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
};

const Navbar = ({ setToken }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">

        {/* ── Left — logo + badge ── */}
        <div className="flex items-center gap-3">
          <img
            className="w-[max(8%,72px)]"
            src={assets.logo}
            alt="Logo"
          />

          {/* Divider */}
          <div className="hidden sm:block w-px h-5 bg-gray-200" />

          {/* Admin badge */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-100"
          >
            <span className="text-gray-400">{Icons.shield}</span>
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500">
              Admin Panel
            </span>
          </motion.div>
        </div>

        {/* ── Right — logout ── */}
        <motion.button
          whileHover={{ scale: 1.03, backgroundColor: "#333" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setToken("")}
          className="group flex items-center gap-2 bg-[#1a1a1a] text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-5 py-2.5 rounded-full transition-colors duration-200"
        >
          <motion.span
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          >
            {Icons.logout}
          </motion.span>
          <span>Logout</span>
        </motion.button>

      </div>
    </motion.header>
  );
};

export default Navbar;