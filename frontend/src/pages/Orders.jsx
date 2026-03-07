import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

/* ── Inline icons ── */
const Icons = {
  package: (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.375c0 .621.504 1.125 1.125 1.125z"
      />
    </svg>
  ),
  check: (
    <svg
      className="w-3 h-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  ),
  clock: (
    <svg
      className="w-3 h-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  truck: (
    <svg
      className="w-3 h-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
      />
    </svg>
  ),
  refresh: (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  ),
  calendar: (
    <svg
      className="w-3 h-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  ),
  creditCard: (
    <svg
      className="w-3 h-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
      />
    </svg>
  ),
  emptyBox: (
    <svg
      className="w-10 h-10 text-gray-200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.375c0 .621.504 1.125 1.125 1.125z"
      />
    </svg>
  ),
};

/* ── Status config ── */
const statusConfig = {
  Delivered: {
    dot: "bg-green-500",
    text: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-100",
    icon: Icons.check,
    label: "Delivered",
  },
  "Out for Delivery": {
    dot: "bg-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-100",
    icon: Icons.truck,
    label: "Out for Delivery",
  },
  default: {
    dot: "bg-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-100",
    icon: Icons.clock,
    label: "In Progress",
  },
};

const getStatus = (status) =>
  statusConfig[status] || {
    ...statusConfig.default,
    label: status || "Ready to Ship",
  };

/* ── Variants ── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
  },
  exit: { opacity: 0, x: -16, transition: { duration: 0.2 } },
};

/* ── Orders ── */
const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrderData = async () => {
    try {
      if (!token) return null;
      setLoading(true);
      const response = await axios.post(
        backendUrl + "/api/order/userOrders",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        let allOrdersItems = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            allOrdersItems.push(item);
          });
        });
        setOrderData(allOrdersItems.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error(error.response?.data?.message || "Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 pt-16 pb-20">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        className="mb-8 border-b border-gray-100 pb-6"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 tracking-wide mb-3">
          <span className="hover:text-gray-600 cursor-pointer transition-colors">
            Home
          </span>
          <svg
            className="w-3 h-3 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="font-semibold text-gray-600">My Orders</span>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "2rem" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-[1.5px] bg-[#414141] shrink-0"
              />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">
                Account
              </span>
            </div>
            <div className="text-3xl sm:text-4xl">
              <Title text1={"My"} text2={"ORDERS"} />
            </div>
          </div>

          {/* Live count + refresh */}
          <div className="flex items-center gap-3 pb-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={orderData.length}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-100"
              >
                <span className="text-gray-400">{Icons.package}</span>
                <span className="text-[10px] text-gray-400 tracking-wide uppercase font-medium">
                  Orders
                </span>
                <span className="text-sm font-black text-[#1a1a1a] tabular-nums">
                  {orderData.length}
                </span>
              </motion.div>
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={loadOrderData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-gray-200 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-[#1a1a1a] hover:border-gray-400 transition-colors disabled:opacity-40"
            >
              <motion.span
                animate={loading ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  loading
                    ? { duration: 1, repeat: Infinity, ease: "linear" }
                    : {}
                }
              >
                {Icons.refresh}
              </motion.span>
              Refresh
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Body ── */}
      <AnimatePresence mode="wait">
        {/* Loading */}
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 gap-4"
          >
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-gray-100" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-t-[#1a1a1a] border-r-transparent border-b-transparent border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-gray-400">
              Loading orders…
            </p>
          </motion.div>
        )}

        {/* Empty */}
        {!loading && orderData.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center gap-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-20 h-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center"
            >
              {Icons.emptyBox}
            </motion.div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                No orders yet
              </p>
              <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
                When you place an order, it'll appear here.
              </p>
            </div>
          </motion.div>
        )}

        {/* List */}
        {!loading && orderData.length > 0 && (
          <motion.div
            key="list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {orderData.map((item, index) => {
              const s = getStatus(item.status);
              return (
                <motion.div
                  key={index}
                  variants={rowVariants}
                  layout
                  className="group relative py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-5 hover:bg-gray-50/60 transition-colors duration-200 -mx-4 px-4 rounded-2xl"
                >
                  {/* Zero-padded index */}
                  <span className="hidden md:block absolute -left-1 top-1/2 -translate-y-1/2 text-[9px] font-black tracking-widest text-gray-200 group-hover:text-gray-400 transition-colors select-none tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Left — image + info */}
                  <div className="flex items-start gap-5 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        className="w-16 sm:w-20 aspect-square object-cover rounded-xl border border-gray-100"
                        src={item.image?.[0] || item.image}
                        alt={item.name}
                      />
                      {/* Hover top-accent */}
                      <motion.div
                        className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#1a1a1a] origin-left rounded-t-xl"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#1a1a1a] text-sm sm:text-base mb-2 truncate">
                        {item.name}
                      </p>

                      {/* Meta chips */}
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600 tracking-wide">
                          {currency}
                          {item.price}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600 tracking-wide">
                          Qty {item.quantity}
                        </span>
                        {item.size && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600 tracking-wide uppercase">
                            {item.size}
                          </span>
                        )}
                      </div>

                      {/* Date + payment */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          {Icons.calendar}
                          {item.date
                            ? new Date(item.date).toDateString()
                            : "25 Jul 2026"}
                        </span>
                        <span className="w-px h-3 bg-gray-200" />
                        <span className="flex items-center gap-1">
                          {Icons.creditCard}
                          {item.paymentMethod}
                          <span
                            className={`ml-1 font-semibold ${item.payment ? "text-green-600" : "text-amber-500"}`}
                          >
                            · {item.payment ? "Paid" : "Pending"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right — status + action */}
                  <div className="flex items-center justify-between md:justify-end gap-4 md:w-auto shrink-0">
                    {/* Status badge */}
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-semibold tracking-wide ${s.bg} ${s.border} ${s.text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${s.dot} shrink-0`}
                      />
                      {s.label}
                    </div>

                    {/* Track button */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={loadOrderData}
                      className="group/btn flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-600 hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-all duration-200"
                    >
                      <span className="transition-transform duration-200 group-hover/btn:translate-x-0.5">
                        {Icons.truck}
                      </span>
                      Track
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4"
            >
              <p className="text-xs text-gray-400 tracking-wide">
                Showing all{" "}
                <span className="font-semibold text-gray-700 tabular-nums">
                  {orderData.length}
                </span>{" "}
                order{orderData.length !== 1 ? "s" : ""}
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={loadOrderData}
                className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400 hover:text-[#1a1a1a] transition-colors duration-200"
              >
                {Icons.refresh} Refresh orders
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
