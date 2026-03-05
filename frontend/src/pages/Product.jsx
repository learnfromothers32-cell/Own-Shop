import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/shopContext";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import RelatedProducts from "../components/RelatedProducts";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const STAR_PATH = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

const Star = ({ filled }) => (
  <svg className={`w-4 h-4 ${filled ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
    <path d={STAR_PATH} />
  </svg>
);

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage]             = useState("");
  const [size, setSize]               = useState("");
  const [activeTab, setActiveTab]     = useState("description");
  const [addedAnim, setAddedAnim]     = useState(false);
  const [wishlisted, setWishlisted]   = useState(false);
  const [zoomed, setZoomed]           = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      const p = products.find((p) => p._id === productId);
      if (p) { setProductData(p); setImage(p.image[0]); setSize(""); }
    }
  }, [productId, products]);

  const handleAddToCart = () => {
    if (!size) return;
    addToCart(productData._id, size);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 2200);
  };

  if (!productData)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          className="w-9 h-9 border-2 border-gray-100 border-t-gray-700 rounded-full"
        />
      </div>
    );

  const originalPrice = Math.round(productData.price * 1.25);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* ── Dot-grid texture ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-12 xl:px-20 pt-10 pb-24">

        {/* ── Breadcrumb ── */}
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-10"
        >
          <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link to="/collection" className="hover:text-gray-700 transition-colors">Collection</Link>
          <span className="text-gray-300">/</span>
          <span className="text-[#1a1a1a]">{productData.name}</span>
        </motion.div>

        {/* ══════════════════════════════
            MAIN PRODUCT LAYOUT
        ══════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* ── LEFT: Image gallery ── */}
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="flex flex-col-reverse sm:flex-row gap-4"
          >
            {/* Thumbnail rail */}
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[580px] sm:w-[72px] shrink-0 pb-1">
              {productData.image.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => setImage(img)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className={`shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    image === img
                      ? "border-[#1a1a1a] shadow-sm"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img src={img} alt={`view ${i + 1}`} className="w-16 sm:w-full aspect-square object-cover" />
                </motion.button>
              ))}
            </div>

            {/* Main image */}
            <div
              className="flex-1 relative rounded-3xl overflow-hidden bg-[#f8f6f1] cursor-zoom-in group"
              onClick={() => setZoomed(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={image}
                  src={image}
                  alt={productData.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover object-top aspect-[3/4]"
                />
              </AnimatePresence>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 pointer-events-none" />

              {/* Zoom pill */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md rounded-full px-3.5 py-2 flex items-center gap-2 text-[10px] font-semibold text-gray-600 shadow-sm"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                Click to zoom
              </motion.div>

              {/* Bestseller badge */}
              {productData.bestseller && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 380 }}
                  className="absolute top-5 left-5 flex items-center gap-1.5 bg-amber-500 text-white text-[10px] font-black tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full shadow-lg shadow-amber-500/30"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                  Best Seller
                </motion.div>
              )}

              {/* Discount badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute top-5 right-5 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-full shadow-md"
              >
                −20%
              </motion.div>
            </div>
          </motion.div>

          {/* ── RIGHT: Product info ── */}
          <div className="flex flex-col justify-start lg:pt-2">

            {/* Category + sub pill */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-violet-600 bg-violet-50 border border-violet-100 px-3.5 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                {productData.category} · {productData.subCategory}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="prata-regular text-[clamp(1.6rem,3.5vw,2.6rem)] leading-[1.1] tracking-tight text-[#1a1a1a] mt-4"
            >
              {productData.name}
            </motion.h1>

            {/* Stars + stock */}
            <motion.div
              custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className="flex items-center gap-3 mt-3"
            >
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((s) => <Star key={s} filled={s <= 4} />)}
              </div>
              <span className="text-xs text-gray-500 font-medium">4.0 · 122 reviews</span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                In Stock
              </span>
            </motion.div>

            {/* Price block */}
            <motion.div
              custom={4} variants={fadeUp} initial="hidden" animate="visible"
              className="flex items-end gap-3 mt-6 pb-6 border-b border-gray-100"
            >
              <span className="text-[2.5rem] font-black leading-none text-[#1a1a1a]">
                {currency}{productData.price}
              </span>
              <div className="flex flex-col gap-0.5 pb-1">
                <span className="text-sm text-gray-400 line-through">{currency}{originalPrice}</span>
                <span className="text-[10px] font-bold text-emerald-600 tracking-wide">Save {currency}{originalPrice - productData.price}</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              custom={5} variants={fadeUp} initial="hidden" animate="visible"
              className="text-sm text-gray-500 leading-relaxed mt-6"
            >
              {productData.description}
            </motion.p>

            {/* Size selector - changed to Device Model selector for phone accessories */}
            <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="mt-7">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-black tracking-[0.25em] uppercase text-gray-600">Compatible With</p>
                <button className="text-[11px] font-bold text-violet-500 hover:text-violet-700 transition-colors tracking-wide">
                  Check Compatibility →
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {productData.sizes.map((s) => (
                  <motion.button
                    key={s}
                    onClick={() => setSize(s)}
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.94 }}
                    className={`relative px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                      s === size
                        ? "bg-[#1a1a1a] text-white shadow-lg shadow-black/20"
                        : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {s === size && (
                      <motion.div
                        layoutId="size-pill"
                        className="absolute inset-0 rounded-xl bg-[#1a1a1a] -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      />
                    )}
                    <span className="relative">{s}</span>
                  </motion.button>
                ))}
              </div>
              <AnimatePresence>
                {!size && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[11px] text-gray-400 mt-2.5"
                  >
                    ↑ Select your device model
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* CTA row */}
            <motion.div
              custom={7} variants={fadeUp} initial="hidden" animate="visible"
              className="flex gap-3 mt-8"
            >
              {/* Add to cart */}
              <motion.button
                onClick={handleAddToCart}
                disabled={!size}
                whileHover={size ? { scale: 1.02 } : {}}
                whileTap={size ? { scale: 0.97 } : {}}
                className={`group relative overflow-hidden flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                  size
                    ? "bg-[#1a1a1a] text-white shadow-lg shadow-black/15"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {/* Gradient hover fill */}
                {size && (
                  <motion.span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}

                <AnimatePresence mode="wait">
                  {addedAnim ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="relative flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Added to Cart!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="relative flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Wishlist */}
              <motion.button
                onClick={() => setWishlisted((v) => !v)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 ${
                  wishlisted
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <motion.svg
                  animate={wishlisted ? { scale: [1, 1.35, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className={`w-5 h-5 transition-colors ${wishlisted ? "text-red-500" : "text-gray-400"}`}
                  fill={wishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </motion.svg>
              </motion.button>
            </motion.div>

            {/* Trust badges - updated for phone accessories */}
            <motion.div
              custom={8} variants={fadeUp} initial="hidden" animate="visible"
              className="grid grid-cols-3 gap-3 mt-6"
            >
              {[
                { icon: "🔄", label: "30-Day Returns",   sub: "Hassle-free"   },
                { icon: "🔒", label: "1-Year Warranty",  sub: "Full coverage"  },
                { icon: "✅", label: "Certified",  sub: "MFi Certified"       },
              ].map(({ icon, label, sub }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center text-center p-3.5 rounded-2xl bg-gray-50 border border-gray-100 gap-1.5"
                >
                  <span className="text-xl">{icon}</span>
                  <p className="text-[10px] font-bold text-gray-700 leading-tight">{label}</p>
                  <p className="text-[9px] text-gray-400">{sub}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Delivery estimate */}
            <motion.div
              custom={9} variants={fadeUp} initial="hidden" animate="visible"
              className="flex items-center gap-3 mt-5 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100"
            >
              <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <p className="text-[11px] text-emerald-700 font-semibold">
                Order now — estimated delivery <span className="font-black">Wed, Mar 7</span>
              </p>
            </motion.div>
          </div>
        </div>

        {/* ══════════════════════════════
            TABS
        ══════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mt-24"
        >
          {/* Tab header */}
          <div className="flex gap-1 border-b border-gray-100 mb-10 overflow-x-auto">
            {[
              { key: "description", label: "Description"        },
              { key: "reviews",     label: "Reviews (122)"      },
              { key: "shipping",    label: "Shipping & Returns"  },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative shrink-0 px-6 py-3.5 text-sm font-bold tracking-wide transition-colors ${
                  activeTab === key ? "text-[#1a1a1a]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {label}
                {activeTab === key && (
                  <motion.div
                    layoutId="tab-line"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a] rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* Description - updated for phone accessories */}
            {activeTab === "description" && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl"
              >
                <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
                  <p>
                    Precision engineered for your device, this accessory combines premium materials 
                    with thoughtful design. Whether you need protection, charging capabilities, or 
                    enhanced functionality, we've got you covered.
                  </p>
                  <p>
                    Every product undergoes rigorous testing to ensure compatibility and performance.
                    From drop protection to fast charging speeds, our accessories are built to enhance 
                    your daily tech experience.
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-black tracking-[0.25em] uppercase text-gray-400 mb-4">Specifications</p>
                  <ul className="space-y-3">
                    {[
                      "Premium materials - durable and long-lasting",
                      "Precision cutouts for easy access to ports",
                      "Supports wireless charging (where applicable)",
                      "Slim profile design",
                      "Includes 1-year manufacturer warranty",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl"
              >
                {/* Summary card */}
                <div className="flex flex-col sm:flex-row items-start gap-8 p-7 rounded-3xl bg-[#fafaf8] border border-gray-100 mb-10">
                  <div className="text-center shrink-0">
                    <p className="text-6xl font-black text-[#1a1a1a] leading-none">4.0</p>
                    <div className="flex gap-0.5 justify-center mt-2">
                      {[1,2,3,4,5].map((s) => <Star key={s} filled={s <= 4} />)}
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 font-medium">122 verified reviews</p>
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    {[["5★", "68%", 68], ["4★", "18%", 18], ["3★", "9%", 9], ["2★", "3%", 3], ["1★", "2%", 2]].map(([star, label, pct]) => (
                      <div key={star} className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="w-6 shrink-0 font-semibold">{star}</span>
                        <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                            className="h-full bg-amber-400 rounded-full"
                          />
                        </div>
                        <span className="w-8 text-right font-semibold">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review cards */}
                <div className="space-y-1">
                  {[
                    { name: "Sarah K.", rating: 5, date: "2 weeks ago", verified: true, text: "Perfect fit for my iPhone 15! The quality is excellent and it arrived quickly. Highly recommend." },
                    { name: "James O.", rating: 4, date: "1 month ago", verified: true, text: "Great charger, works with my Samsung S24. Fast delivery and good packaging. Would buy again." },
                  ].map(({ name, rating, date, verified, text }, i) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="py-6 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-black shrink-0">
                            {name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-gray-800">{name}</p>
                              {verified && (
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Verified</span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5">{date}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 shrink-0">
                          {Array.from({ length: rating }).map((_, i) => <Star key={i} filled />)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed pl-12">{text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Shipping */}
            {activeTab === "shipping" && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl grid sm:grid-cols-2 gap-4"
              >
                {[
                  { icon: "🚚", title: "Standard Delivery",  body: "3–5 business days. Free on orders over $50, otherwise $4.99." },
                  { icon: "⚡", title: "Express Delivery",   body: "1–2 business days. Flat rate of $9.99 on all orders."          },
                  { icon: "🔄", title: "30-Day Returns",       body: "Return within 30 days for a full refund — no questions asked."   },
                  { icon: "📦", title: "Warranty Coverage",          body: "All products include 1-year warranty against defects."    },
                ].map(({ icon, title, body }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="p-6 rounded-2xl bg-[#fafaf8] border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    <span className="text-2xl">{icon}</span>
                    <p className="text-sm font-bold text-[#1a1a1a] mt-3 mb-1.5">{title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>

        {/* ── Related products ── */}
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
          currentProductId={productData._id}
        />
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.img
              src={image}
              alt={productData.name}
              initial={{ scale: 0.82, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.82, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="max-h-[90vh] max-w-full object-contain rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Thumbnail strip inside lightbox */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {productData.image.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setImage(img); }}
                  whileHover={{ scale: 1.1 }}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                    image === img ? "border-white" : "border-white/20 hover:border-white/50"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>

            {/* Close */}
            <motion.button
              onClick={() => setZoomed(false)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Product;










































// import React, { useContext, useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { ShopContext } from "../context/shopContext";
// import { assets } from "../assets/assets";
// import { motion, AnimatePresence } from "framer-motion";
// import RelatedProducts from "../components/RelatedProducts";

// const fadeUp = {
//   hidden: { opacity: 0, y: 28 },
//   visible: (i = 0) => ({
//     opacity: 1, y: 0,
//     transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
//   }),
// };

// const STAR_PATH = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

// const Star = ({ filled }) => (
//   <svg className={`w-4 h-4 ${filled ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
//     <path d={STAR_PATH} />
//   </svg>
// );

// const Product = () => {
//   const { productId } = useParams();
//   const { products, currency, addToCart } = useContext(ShopContext);
//   const [productData, setProductData] = useState(null);
//   const [image, setImage]             = useState("");
//   const [size, setSize]               = useState("");
//   const [activeTab, setActiveTab]     = useState("description");
//   const [addedAnim, setAddedAnim]     = useState(false);
//   const [wishlisted, setWishlisted]   = useState(false);
//   const [zoomed, setZoomed]           = useState(false);

//   useEffect(() => {
//     if (products.length > 0) {
//       const p = products.find((p) => p._id === productId);
//       if (p) { setProductData(p); setImage(p.image[0]); setSize(""); }
//     }
//   }, [productId, products]);

//   const handleAddToCart = () => {
//     if (!size) return;
//     addToCart(productData._id, size);
//     setAddedAnim(true);
//     setTimeout(() => setAddedAnim(false), 2200);
//   };

//   if (!productData)
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
//           className="w-9 h-9 border-2 border-gray-100 border-t-gray-700 rounded-full"
//         />
//       </div>
//     );

//   const originalPrice = Math.round(productData.price * 1.25);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.4 }}
//       className="w-full"
//     >
//       {/* ── Dot-grid texture ── */}
//       <div
//         className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
//         style={{
//           backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
//           backgroundSize: "32px 32px",
//         }}
//       />

//       <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-12 xl:px-20 pt-10 pb-24">

//         {/* ── Breadcrumb ── */}
//         <motion.div
//           custom={0} variants={fadeUp} initial="hidden" animate="visible"
//           className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-10"
//         >
//           <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
//           <span className="text-gray-300">/</span>
//           <Link to="/collection" className="hover:text-gray-700 transition-colors">Collection</Link>
//           <span className="text-gray-300">/</span>
//           <span className="text-[#1a1a1a]">{productData.name}</span>
//         </motion.div>

//         {/* ══════════════════════════════
//             MAIN PRODUCT LAYOUT
//         ══════════════════════════════ */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

//           {/* ── LEFT: Image gallery ── */}
//           <motion.div
//             custom={0} variants={fadeUp} initial="hidden" animate="visible"
//             className="flex flex-col-reverse sm:flex-row gap-4"
//           >
//             {/* Thumbnail rail */}
//             <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[580px] sm:w-[72px] shrink-0 pb-1">
//               {productData.image.map((img, i) => (
//                 <motion.button
//                   key={i}
//                   onClick={() => setImage(img)}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.96 }}
//                   className={`shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
//                     image === img
//                       ? "border-[#1a1a1a] shadow-sm"
//                       : "border-transparent hover:border-gray-300"
//                   }`}
//                 >
//                   <img src={img} alt={`view ${i + 1}`} className="w-16 sm:w-full aspect-square object-cover" />
//                 </motion.button>
//               ))}
//             </div>

//             {/* Main image */}
//             <div
//               className="flex-1 relative rounded-3xl overflow-hidden bg-[#f8f6f1] cursor-zoom-in group"
//               onClick={() => setZoomed(true)}
//             >
//               <AnimatePresence mode="wait">
//                 <motion.img
//                   key={image}
//                   src={image}
//                   alt={productData.name}
//                   initial={{ opacity: 0, scale: 1.05 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.98 }}
//                   transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
//                   className="w-full h-full object-cover object-top aspect-[3/4]"
//                 />
//               </AnimatePresence>

//               {/* Hover overlay */}
//               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 pointer-events-none" />

//               {/* Zoom pill */}
//               <motion.div
//                 initial={{ opacity: 0, y: 8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.8 }}
//                 className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md rounded-full px-3.5 py-2 flex items-center gap-2 text-[10px] font-semibold text-gray-600 shadow-sm"
//               >
//                 <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
//                 </svg>
//                 Click to zoom
//               </motion.div>

//               {/* Bestseller badge */}
//               {productData.bestseller && (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.8, y: -8 }}
//                   animate={{ opacity: 1, scale: 1, y: 0 }}
//                   transition={{ delay: 0.5, type: "spring", stiffness: 380 }}
//                   className="absolute top-5 left-5 flex items-center gap-1.5 bg-amber-500 text-white text-[10px] font-black tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full shadow-lg shadow-amber-500/30"
//                 >
//                   <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
//                   Best Seller
//                 </motion.div>
//               )}

//               {/* Discount badge */}
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.6 }}
//                 className="absolute top-5 right-5 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-full shadow-md"
//               >
//                 −20%
//               </motion.div>
//             </div>
//           </motion.div>

//           {/* ── RIGHT: Product info ── */}
//           <div className="flex flex-col justify-start lg:pt-2">

//             {/* Category + sub pill */}
//             <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
//               <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-violet-600 bg-violet-50 border border-violet-100 px-3.5 py-1.5 rounded-full">
//                 <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
//                 {productData.category} · {productData.subCategory}
//               </span>
//             </motion.div>

//             {/* Name */}
//             <motion.h1
//               custom={2} variants={fadeUp} initial="hidden" animate="visible"
//               className="prata-regular text-[clamp(1.6rem,3.5vw,2.6rem)] leading-[1.1] tracking-tight text-[#1a1a1a] mt-4"
//             >
//               {productData.name}
//             </motion.h1>

//             {/* Stars + stock */}
//             <motion.div
//               custom={3} variants={fadeUp} initial="hidden" animate="visible"
//               className="flex items-center gap-3 mt-3"
//             >
//               <div className="flex items-center gap-0.5">
//                 {[1,2,3,4,5].map((s) => <Star key={s} filled={s <= 4} />)}
//               </div>
//               <span className="text-xs text-gray-500 font-medium">4.0 · 122 reviews</span>
//               <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
//                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
//                 In Stock
//               </span>
//             </motion.div>

//             {/* Price block */}
//             <motion.div
//               custom={4} variants={fadeUp} initial="hidden" animate="visible"
//               className="flex items-end gap-3 mt-6 pb-6 border-b border-gray-100"
//             >
//               <span className="text-[2.5rem] font-black leading-none text-[#1a1a1a]">
//                 {currency}{productData.price}
//               </span>
//               <div className="flex flex-col gap-0.5 pb-1">
//                 <span className="text-sm text-gray-400 line-through">{currency}{originalPrice}</span>
//                 <span className="text-[10px] font-bold text-emerald-600 tracking-wide">Save {currency}{originalPrice - productData.price}</span>
//               </div>
//             </motion.div>

//             {/* Description */}
//             <motion.p
//               custom={5} variants={fadeUp} initial="hidden" animate="visible"
//               className="text-sm text-gray-500 leading-relaxed mt-6"
//             >
//               {productData.description}
//             </motion.p>

//             {/* Size selector */}
//             <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="mt-7">
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-[11px] font-black tracking-[0.25em] uppercase text-gray-600">Select Size</p>
//                 <button className="text-[11px] font-bold text-violet-500 hover:text-violet-700 transition-colors tracking-wide">
//                   Size Guide →
//                 </button>
//               </div>
//               <div className="flex flex-wrap gap-2.5">
//                 {productData.sizes.map((s) => (
//                   <motion.button
//                     key={s}
//                     onClick={() => setSize(s)}
//                     whileHover={{ scale: 1.07 }}
//                     whileTap={{ scale: 0.94 }}
//                     className={`relative w-13 h-12 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
//                       s === size
//                         ? "bg-[#1a1a1a] text-white shadow-lg shadow-black/20"
//                         : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-500 hover:text-gray-800"
//                     }`}
//                   >
//                     {s === size && (
//                       <motion.div
//                         layoutId="size-pill"
//                         className="absolute inset-0 rounded-xl bg-[#1a1a1a] -z-10"
//                         transition={{ type: "spring", stiffness: 400, damping: 28 }}
//                       />
//                     )}
//                     <span className="relative">{s}</span>
//                   </motion.button>
//                 ))}
//               </div>
//               <AnimatePresence>
//                 {!size && (
//                   <motion.p
//                     initial={{ opacity: 0, y: -4 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0 }}
//                     className="text-[11px] text-gray-400 mt-2.5"
//                   >
//                     ↑ Pick a size to unlock Add to Cart
//                   </motion.p>
//                 )}
//               </AnimatePresence>
//             </motion.div>

//             {/* CTA row */}
//             <motion.div
//               custom={7} variants={fadeUp} initial="hidden" animate="visible"
//               className="flex gap-3 mt-8"
//             >
//               {/* Add to cart */}
//               <motion.button
//                 onClick={handleAddToCart}
//                 disabled={!size}
//                 whileHover={size ? { scale: 1.02 } : {}}
//                 whileTap={size ? { scale: 0.97 } : {}}
//                 className={`group relative overflow-hidden flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 ${
//                   size
//                     ? "bg-[#1a1a1a] text-white shadow-lg shadow-black/15"
//                     : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 {/* Gradient hover fill */}
//                 {size && (
//                   <motion.span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                 )}

//                 <AnimatePresence mode="wait">
//                   {addedAnim ? (
//                     <motion.span
//                       key="added"
//                       initial={{ opacity: 0, y: 8 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -8 }}
//                       className="relative flex items-center gap-2"
//                     >
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                       </svg>
//                       Added to Cart!
//                     </motion.span>
//                   ) : (
//                     <motion.span
//                       key="add"
//                       initial={{ opacity: 0, y: 8 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -8 }}
//                       className="relative flex items-center gap-2"
//                     >
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                       </svg>
//                       Add to Cart
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </motion.button>

//               {/* Wishlist */}
//               <motion.button
//                 onClick={() => setWishlisted((v) => !v)}
//                 whileHover={{ scale: 1.08 }}
//                 whileTap={{ scale: 0.92 }}
//                 className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 ${
//                   wishlisted
//                     ? "border-red-300 bg-red-50"
//                     : "border-gray-200 hover:border-gray-400"
//                 }`}
//               >
//                 <motion.svg
//                   animate={wishlisted ? { scale: [1, 1.35, 1] } : {}}
//                   transition={{ duration: 0.3 }}
//                   className={`w-5 h-5 transition-colors ${wishlisted ? "text-red-500" : "text-gray-400"}`}
//                   fill={wishlisted ? "currentColor" : "none"}
//                   stroke="currentColor"
//                   strokeWidth="1.8"
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                 </motion.svg>
//               </motion.button>
//             </motion.div>

//             {/* Trust badges */}
//             <motion.div
//               custom={8} variants={fadeUp} initial="hidden" animate="visible"
//               className="grid grid-cols-3 gap-3 mt-6"
//             >
//               {[
//                 { icon: "🔄", label: "Free Returns",   sub: "Within 7 days"   },
//                 { icon: "🚚", label: "Free Delivery",  sub: "Orders over $50"  },
//                 { icon: "✅", label: "100% Original",  sub: "Guaranteed"       },
//               ].map(({ icon, label, sub }) => (
//                 <motion.div
//                   key={label}
//                   whileHover={{ y: -3 }}
//                   transition={{ duration: 0.2 }}
//                   className="flex flex-col items-center text-center p-3.5 rounded-2xl bg-gray-50 border border-gray-100 gap-1.5"
//                 >
//                   <span className="text-xl">{icon}</span>
//                   <p className="text-[10px] font-bold text-gray-700 leading-tight">{label}</p>
//                   <p className="text-[9px] text-gray-400">{sub}</p>
//                 </motion.div>
//               ))}
//             </motion.div>

//             {/* Delivery estimate */}
//             <motion.div
//               custom={9} variants={fadeUp} initial="hidden" animate="visible"
//               className="flex items-center gap-3 mt-5 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100"
//             >
//               <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
//               </svg>
//               <p className="text-[11px] text-emerald-700 font-semibold">
//                 Order now — estimated delivery <span className="font-black">Wed, Mar 7</span>
//               </p>
//             </motion.div>
//           </div>
//         </div>

//         {/* ══════════════════════════════
//             TABS
//         ══════════════════════════════ */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.65 }}
//           className="mt-24"
//         >
//           {/* Tab header */}
//           <div className="flex gap-1 border-b border-gray-100 mb-10 overflow-x-auto">
//             {[
//               { key: "description", label: "Description"        },
//               { key: "reviews",     label: "Reviews (122)"      },
//               { key: "shipping",    label: "Shipping & Returns"  },
//             ].map(({ key, label }) => (
//               <button
//                 key={key}
//                 onClick={() => setActiveTab(key)}
//                 className={`relative shrink-0 px-6 py-3.5 text-sm font-bold tracking-wide transition-colors ${
//                   activeTab === key ? "text-[#1a1a1a]" : "text-gray-400 hover:text-gray-600"
//                 }`}
//               >
//                 {label}
//                 {activeTab === key && (
//                   <motion.div
//                     layoutId="tab-line"
//                     className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a] rounded-full"
//                   />
//                 )}
//               </button>
//             ))}
//           </div>

//           <AnimatePresence mode="wait">

//             {/* Description */}
//             {activeTab === "description" && (
//               <motion.div
//                 key="desc"
//                 initial={{ opacity: 0, y: 14 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}
//                 className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl"
//               >
//                 <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
//                   <p>
//                     Crafted for those who refuse to compromise between comfort and style.
//                     This piece is made from premium, sustainably sourced fabric that moves
//                     with you — whether you're navigating a busy city or stepping into a boardroom.
//                   </p>
//                   <p>
//                     Every stitch is a testament to our commitment to quality. Reinforced seams,
//                     colourfast dyes, and pre-washed fabric ensure this garment looks as good on
//                     the hundredth wear as it does on the first.
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-[11px] font-black tracking-[0.25em] uppercase text-gray-400 mb-4">Product Details</p>
//                   <ul className="space-y-3">
//                     {[
//                       "Premium quality, sustainably sourced fabric",
//                       "Machine washable at 30°C",
//                       "Slim fit — true to size",
//                       "Ethically manufactured",
//                       "Colourfast dyes — won't bleed or fade",
//                     ].map((f) => (
//                       <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
//                         <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
//                           <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         {f}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </motion.div>
//             )}

//             {/* Reviews */}
//             {activeTab === "reviews" && (
//               <motion.div
//                 key="reviews"
//                 initial={{ opacity: 0, y: 14 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}
//                 className="max-w-3xl"
//               >
//                 {/* Summary card */}
//                 <div className="flex flex-col sm:flex-row items-start gap-8 p-7 rounded-3xl bg-[#fafaf8] border border-gray-100 mb-10">
//                   <div className="text-center shrink-0">
//                     <p className="text-6xl font-black text-[#1a1a1a] leading-none">4.0</p>
//                     <div className="flex gap-0.5 justify-center mt-2">
//                       {[1,2,3,4,5].map((s) => <Star key={s} filled={s <= 4} />)}
//                     </div>
//                     <p className="text-xs text-gray-400 mt-1.5 font-medium">122 verified reviews</p>
//                   </div>
//                   <div className="flex-1 w-full space-y-2">
//                     {[["5★", "68%", 68], ["4★", "18%", 18], ["3★", "9%", 9], ["2★", "3%", 3], ["1★", "2%", 2]].map(([star, label, pct]) => (
//                       <div key={star} className="flex items-center gap-3 text-xs text-gray-500">
//                         <span className="w-6 shrink-0 font-semibold">{star}</span>
//                         <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
//                           <motion.div
//                             initial={{ width: 0 }}
//                             whileInView={{ width: `${pct}%` }}
//                             viewport={{ once: true }}
//                             transition={{ duration: 0.9, ease: "easeOut" }}
//                             className="h-full bg-amber-400 rounded-full"
//                           />
//                         </div>
//                         <span className="w-8 text-right font-semibold">{label}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Review cards */}
//                 <div className="space-y-1">
//                   {[
//                     { name: "Sarah K.", rating: 5, date: "2 weeks ago", verified: true, text: "Absolutely love this piece. The fabric quality exceeded my expectations and the fit is perfect. Already ordered in two more colours!" },
//                     { name: "James O.", rating: 4, date: "1 month ago", verified: true, text: "Great quality and fast shipping. Sizing runs slightly large so I'd recommend going one size down. Overall very happy with this purchase." },
//                   ].map(({ name, rating, date, verified, text }, i) => (
//                     <motion.div
//                       key={name}
//                       initial={{ opacity: 0, y: 16 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       viewport={{ once: true }}
//                       transition={{ delay: i * 0.1 }}
//                       className="py-6 border-b border-gray-100 last:border-0"
//                     >
//                       <div className="flex items-start justify-between gap-4 mb-3">
//                         <div className="flex items-center gap-3">
//                           <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-black shrink-0">
//                             {name[0]}
//                           </div>
//                           <div>
//                             <div className="flex items-center gap-2">
//                               <p className="text-sm font-bold text-gray-800">{name}</p>
//                               {verified && (
//                                 <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Verified</span>
//                               )}
//                             </div>
//                             <p className="text-[11px] text-gray-400 mt-0.5">{date}</p>
//                           </div>
//                         </div>
//                         <div className="flex gap-0.5 shrink-0">
//                           {Array.from({ length: rating }).map((_, i) => <Star key={i} filled />)}
//                         </div>
//                       </div>
//                       <p className="text-sm text-gray-500 leading-relaxed pl-12">{text}</p>
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>
//             )}

//             {/* Shipping */}
//             {activeTab === "shipping" && (
//               <motion.div
//                 key="shipping"
//                 initial={{ opacity: 0, y: 14 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}
//                 className="max-w-3xl grid sm:grid-cols-2 gap-4"
//               >
//                 {[
//                   { icon: "🚚", title: "Standard Delivery",  body: "3–5 business days. Free on orders over $50, otherwise $4.99." },
//                   { icon: "⚡", title: "Express Delivery",   body: "1–2 business days. Flat rate of $9.99 on all orders."          },
//                   { icon: "🔄", title: "Free Returns",       body: "Return within 7 days for a full refund — no questions asked."   },
//                   { icon: "📦", title: "Exchanges",          body: "Need a different size? We'll handle the swap, free shipping."    },
//                 ].map(({ icon, title, body }, i) => (
//                   <motion.div
//                     key={title}
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: i * 0.08 }}
//                     whileHover={{ y: -4 }}
//                     className="p-6 rounded-2xl bg-[#fafaf8] border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
//                   >
//                     <span className="text-2xl">{icon}</span>
//                     <p className="text-sm font-bold text-[#1a1a1a] mt-3 mb-1.5">{title}</p>
//                     <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             )}

//           </AnimatePresence>
//         </motion.div>

//         {/* ── Related products ── */}
//         <RelatedProducts
//           category={productData.category}
//           subCategory={productData.subCategory}
//           currentProductId={productData._id}
//         />
//       </div>

//       {/* ── Lightbox ── */}
//       <AnimatePresence>
//         {zoomed && (
//           <motion.div
//             key="lightbox"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setZoomed(false)}
//             className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
//           >
//             <motion.img
//               src={image}
//               alt={productData.name}
//               initial={{ scale: 0.82, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.82, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 260, damping: 24 }}
//               className="max-h-[90vh] max-w-full object-contain rounded-3xl shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             />

//             {/* Thumbnail strip inside lightbox */}
//             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
//               {productData.image.map((img, i) => (
//                 <motion.button
//                   key={i}
//                   onClick={(e) => { e.stopPropagation(); setImage(img); }}
//                   whileHover={{ scale: 1.1 }}
//                   className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
//                     image === img ? "border-white" : "border-white/20 hover:border-white/50"
//                   }`}
//                 >
//                   <img src={img} alt="" className="w-full h-full object-cover" />
//                 </motion.button>
//               ))}
//             </div>

//             {/* Close */}
//             <motion.button
//               onClick={() => setZoomed(false)}
//               whileHover={{ scale: 1.1, rotate: 90 }}
//               transition={{ duration: 0.2 }}
//               className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10 transition-colors"
//             >
//               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </motion.button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default Product;