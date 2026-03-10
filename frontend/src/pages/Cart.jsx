import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { motion, AnimatePresence } from "framer-motion";

/* ── Inline icons ── */
const Icons = {
  chevronRight: (
    <svg
      className="w-3 h-3 text-gray-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  cart: (
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
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  ),
  trash: (
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
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  ),
  minus: (
    <svg
      className="w-3 h-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
    </svg>
  ),
  plus: (
    <svg
      className="w-3 h-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  ),
  arrowRight: (
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
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  ),
  emptyCart: (
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
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  ),
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
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.97,
    transition: { duration: 0.25, ease: [0.33, 1, 0.68, 1] },
  },
};

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  const totalItems = cartData.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 pt-14 pb-20">
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
          {Icons.chevronRight}
          <span className="hover:text-gray-600 cursor-pointer transition-colors">
            Shop
          </span>
          {Icons.chevronRight}
          <span className="font-semibold text-gray-600">Cart</span>
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
                Review
              </span>
            </div>
            <div className="text-3xl sm:text-4xl">
              <Title text1={"YOUR"} text2={"CART"} />
            </div>
          </div>

          {/* Live count badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={totalItems}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-100 mb-1"
            >
              <span className="text-gray-400">{Icons.cart}</span>
              <span className="text-[10px] text-gray-400 tracking-wide uppercase font-medium">
                Items
              </span>
              <span className="text-sm font-black text-[#1a1a1a] tabular-nums">
                {totalItems}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Cart rows ── */}
      <AnimatePresence mode="wait">
        {/* Empty state */}
        {cartData.length === 0 && (
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
              {Icons.emptyCart}
            </motion.div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Your cart is empty
              </p>
              <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
                Add items from the collection to get started.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/collection")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#333] transition-colors"
            >
              Browse Collection {Icons.arrowRight}
            </motion.button>
          </motion.div>
        )}

        {/* Items */}
        {cartData.length > 0 && (
          <motion.div
            key="cart-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {cartData.map((item, index) => {
                const productData = products.find((p) => p._id === item._id);
                return (
                  <motion.div
                    key={`${item._id}-${item.size}`}
                    variants={rowVariants}
                    layout
                    exit="exit"
                    className="group relative py-5 border-b border-gray-100 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors duration-200 -mx-4 px-4 rounded-2xl"
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
                          src={productData?.image[0]}
                          alt={productData?.name}
                        />
                        {/* Hover top-accent line */}
                        <motion.div
                          className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#1a1a1a] origin-left rounded-t-xl pointer-events-none"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.33, 1, 0.68, 1],
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#1a1a1a] text-sm sm:text-base mb-2 truncate">
                          {productData?.name}
                        </p>

                        {/* Meta chips */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600 tracking-wide">
                            {currency}
                            {productData?.price}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600 tracking-wide uppercase">
                            Size: {item.size}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right — qty + delete */}
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Quantity stepper */}
                      <div className="flex items-center gap-1 border border-gray-200 rounded-full px-1 py-1">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.size,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                          className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-[#1a1a1a] transition-colors"
                        >
                          {Icons.minus}
                        </motion.button>

                        <input
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || value === "0") {
                              updateQuantity(item._id, item.size, 0);
                            } else {
                              updateQuantity(
                                item._id,
                                item.size,
                                Number(value),
                              );
                            }
                          }}
                          className="w-8 text-center text-xs font-bold text-[#1a1a1a] bg-transparent border-none outline-none tabular-nums"
                          type="number"
                          min={1}
                          defaultValue={item.quantity}
                        />

                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.size,
                              item.quantity + 1,
                            )
                          }
                          className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-[#1a1a1a] transition-colors"
                        >
                          {Icons.plus}
                        </motion.button>
                      </div>

                      {/* Delete */}
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item._id, item.size, 0)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 border border-transparent hover:border-red-100 transition-all duration-200"
                        title="Remove item"
                      >
                        {Icons.trash}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* ── Summary + Checkout ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.35,
                duration: 0.5,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="flex justify-end mt-16"
            >
              <div className="w-full sm:w-[450px]">
                {/* Summary header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-[1.5px] w-8 bg-[#414141]" />
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">
                    Order Summary
                  </span>
                </div>

                <CartTotal />

                <div className="w-full mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#333" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/place-order")}
                    className="group w-full flex items-center justify-center gap-3 bg-[#1a1a1a] text-white text-[11px] font-semibold tracking-[0.25em] uppercase py-4 rounded-full transition-colors duration-200"
                  >
                    Purchase Now
                    <motion.span className="transition-transform duration-200 group-hover:translate-x-1">
                      {Icons.arrowRight}
                    </motion.span>
                  </motion.button>

                  <p className="text-center text-[10px] text-gray-400 mt-3 tracking-wide">
                    Secure checkout · Free returns
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4"
            >
              <p className="text-xs text-gray-400 tracking-wide">
                <span className="font-semibold text-gray-700 tabular-nums">
                  {cartData.length}
                </span>{" "}
                product{cartData.length !== 1 ? "s" : ""},{" "}
                <span className="font-semibold text-gray-700 tabular-nums">
                  {totalItems}
                </span>{" "}
                item{totalItems !== 1 ? "s" : ""} total
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/collection")}
                className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400 hover:text-[#1a1a1a] transition-colors duration-200"
              >
                Continue shopping {Icons.arrowRight}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
