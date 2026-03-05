import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../context/shopContext";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { setShowSearch, getCartCount, token, setToken, setCartItems, navigate } =
    useContext(ShopContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logOut = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/collection", label: "Collection" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const sidebarVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.25, ease: "easeInOut" } },
  };

  const linkVariants = {
    hidden: { x: 40, opacity: 0 },
    visible: (i) => ({
      x: 0, opacity: 1,
      transition: { delay: i * 0.07 + 0.1, type: "spring", stiffness: 260, damping: 22 },
    }),
  };

  return (
    <>
      {/* Backdrop overlay when sidebar open */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVisible(false)}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className={`sticky top-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-white/70 backdrop-blur-xl shadow-md border-b border-white/40"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        {/* Logo */}
        <Link to="/">
          <motion.img
            src={assets.logo}
            className="w-32"
            alt="Logo"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400 }}
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden sm:flex gap-8 text-sm font-semibold tracking-widest text-gray-500 uppercase">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `relative flex flex-col items-center transition-colors duration-200 ${
                    isActive ? "text-black" : "hover:text-black"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{label}</span>
                    <motion.span
                      className="absolute -bottom-1 left-0 h-[2px] rounded-full bg-black"
                      animate={{ width: isActive ? "100%" : "0%" }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <motion.button
            onClick={() => setShowSearch(true)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <img src={assets.search_icon} alt="Search" className="w-5" />
          </motion.button>

          {/* Profile + Dropdown */}
          <div className="group relative">
            <motion.button
              onClick={() => (!token ? navigate("/login") : null)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <img src={assets.profile_icon} alt="Profile" className="w-5" />
            </motion.button>

            {token && (
              <div className="absolute right-0 pt-3 hidden group-hover:block">
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.18 }}
                  className="w-44 py-2 px-1 bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl"
                >
                  {[
                    { label: "My Profile", action: null },
                    { label: "Orders", action: () => navigate("/orders") },
                    { label: "Log Out", action: logOut, danger: true },
                  ].map(({ label, action, danger }) => (
                    <motion.button
                      key={label}
                      onClick={action}
                      whileHover={{ x: 4 }}
                      className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-colors ${
                        danger
                          ? "text-red-500 font-medium hover:bg-red-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="cart">
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <img src={assets.cart_icon} alt="Cart" className="w-5" />
              <AnimatePresence>
                {getCartCount() > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-black text-white text-[9px] font-bold rounded-full"
                  >
                    {getCartCount()}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>

          {/* Hamburger (mobile) */}
          <motion.button
            onClick={() => setVisible(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <img src={assets.menu_icon} alt="Menu" className="w-5" />
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="sidebar"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-72 bg-white/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <img src={assets.logo} className="w-24" alt="Logo" />
              <motion.button
                onClick={() => setVisible(false)}
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Sidebar Links */}
            <nav className="flex flex-col px-4 pt-6 gap-1">
              {navLinks.map(({ to, label }, i) => (
                <motion.div key={to} custom={i} variants={linkVariants} initial="hidden" animate="visible">
                  <NavLink
                    to={to}
                    onClick={() => setVisible(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-xl text-sm font-semibold tracking-widest uppercase transition-colors ${
                        isActive ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50 hover:text-black"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Logout at bottom */}
            {token && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-auto px-6 pb-8"
              >
                <button
                  onClick={() => { logOut(); setVisible(false); }}
                  className="w-full py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
                >
                  Log Out
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;