import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/shopContext";
import { assets } from "../assets/assets";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import RelatedProducts from "../components/RelatedProducts";

/* ─── animation presets ─── */
const ease = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease },
  }),
};
const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ─── star icon ─── */
const STAR =
  "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

const Star = ({ filled }) => (
  <svg
    className={`w-3.5 h-3.5 ${filled ? "text-amber-400" : "text-gray-200"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d={STAR} />
  </svg>
);

/* ─── quantity stepper ─── */
const QtyStepper = ({ qty, setQty }) => (
  <div className="flex items-center h-12 rounded-xl border border-gray-200 bg-white overflow-hidden select-none">
    <button
      onClick={() => setQty((q) => Math.max(1, q - 1))}
      className="w-11 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors text-lg font-medium"
    >
      −
    </button>
    <span className="w-10 text-center text-sm font-bold text-[#1a1a1a] tabular-nums">
      {qty}
    </span>
    <button
      onClick={() => setQty((q) => Math.min(10, q + 1))}
      className="w-11 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors text-lg font-medium"
    >
      +
    </button>
  </div>
);

/* ══════════════════════════════════════
   PRODUCT PAGE
══════════════════════════════════════ */
const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [addedAnim, setAddedAnim] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [compatOpen, setCompatOpen] = useState(false);

  const ctaRef = useRef(null);
  const [ctaVisible, setCtaVisible] = useState(true);

  /* ── observe CTA visibility for sticky bar ── */
  useEffect(() => {
    if (!ctaRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => setCtaVisible(e.isIntersecting),
      { threshold: 0.4 },
    );
    obs.observe(ctaRef.current);
    return () => obs.disconnect();
  }, [productData]);

  /* ── load product ── */
  useEffect(() => {
    if (products.length > 0) {
      const p = products.find((p) => p._id === productId);
      if (p) {
        setProductData(p);
        setImage(p.image[0]);
        setSize("");
        setQty(1);
      }
    }
  }, [productId, products]);

  /* ── add to cart (no size gate) ── */
  const handleAddToCart = () => {
    addToCart(productData._id, size || "default");
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 2400);
  };

  /* ── loading state ── */
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
  const savings = originalPrice - productData.price;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="w-full"
    >
      {/* subtle texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.018] z-0"
        style={{
          backgroundImage: "radial-gradient(#000 0.8px, transparent 0.8px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 xl:px-20 pt-8 pb-28">
        {/* ── Breadcrumb ── */}
        <motion.nav
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-8"
        >
          <Link to="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <svg
            className="w-3 h-3 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <Link
            to="/collection"
            className="hover:text-gray-700 transition-colors"
          >
            Collection
          </Link>
          <svg
            className="w-3 h-3 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-[#1a1a1a] truncate max-w-[180px]">
            {productData.name}
          </span>
        </motion.nav>

        {/* ═══════════════════════════════════
            HERO: IMAGE + INFO
        ═══════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
          {/* ── LEFT COL: Gallery (7 cols) ── */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3"
          >
            {/* thumbnails */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[620px] sm:w-[68px] shrink-0 scrollbar-none">
              {productData.image.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => setImage(img)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className={`shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    image === img
                      ? "border-[#1a1a1a] shadow-md ring-1 ring-black/5"
                      : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={`view ${i + 1}`}
                    className="w-14 sm:w-full aspect-square object-cover"
                  />
                </motion.button>
              ))}
            </div>

            {/* main image */}
            <div
              className="flex-1 relative rounded-[1.75rem] overflow-hidden bg-gradient-to-br from-[#f5f3ee] to-[#eae7df] cursor-zoom-in group"
              onClick={() => setZoomed(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={image}
                  src={image}
                  alt={productData.name}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.45, ease }}
                  className="w-full h-full object-cover object-top aspect-[3/4]"
                />
              </AnimatePresence>

              {/* hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.03] transition-all duration-500 pointer-events-none" />

              {/* zoom hint */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-lg rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[9px] font-bold text-gray-500 shadow-sm border border-white/60"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
                Zoom
              </motion.div>

              {/* badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {productData.bestseller && (
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                    className="flex items-center gap-1.5 bg-[#1a1a1a] text-white text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1.5 rounded-full shadow-lg"
                  >
                    <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                    Best Seller
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-emerald-500 text-white text-[9px] font-black px-2.5 py-1.5 rounded-full shadow-md w-fit"
                >
                  −20% OFF
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT COL: Product details (5 cols) ── */}
          <div className="lg:col-span-5 flex flex-col">
            {/* category pill */}
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.25em] uppercase text-violet-600 bg-violet-50/80 border border-violet-100 px-3 py-1 rounded-full">
                <span className="w-1 h-1 rounded-full bg-violet-400" />
                {productData.category} · {productData.subCategory}
              </span>
            </motion.div>

            {/* product name */}
            <motion.h1
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="prata-regular text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.12] tracking-tight text-[#1a1a1a] mt-3"
            >
              {productData.name}
            </motion.h1>

            {/* rating row */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center flex-wrap gap-2.5 mt-2.5"
            >
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} filled={s <= 4} />
                ))}
              </div>
              <span className="text-[11px] text-gray-500 font-semibold">
                4.0 · 122 reviews
              </span>
              <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                In Stock
              </span>
            </motion.div>

            {/* ── price + CTA block ── */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              ref={ctaRef}
              className="mt-5 p-5 rounded-2xl bg-gradient-to-b from-gray-50/80 to-white border border-gray-100"
            >
              {/* price */}
              <div className="flex items-end gap-2.5">
                <span className="text-[2.2rem] font-black leading-none text-[#1a1a1a] tracking-tight">
                  {currency}
                  {productData.price}
                </span>
                <span className="text-sm text-gray-400 line-through pb-1">
                  {currency}
                  {originalPrice}
                </span>
                <span className="text-[10px] font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full mb-1">
                  Save {currency}
                  {savings}
                </span>
              </div>

              {/* quick description */}
              <p className="text-[13px] text-gray-500 leading-relaxed mt-3 line-clamp-2">
                {productData.description}
              </p>

              {/* qty + add to cart */}
              <div className="flex items-center gap-3 mt-5">
                <QtyStepper qty={qty} setQty={setQty} />

                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.975 }}
                  className="group relative flex-1 h-12 rounded-xl overflow-hidden bg-[#1a1a1a] text-white shadow-lg shadow-black/10 active:shadow-sm transition-shadow"
                >
                  {/* gradient sweep on hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[length:200%_100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_2s_linear_infinite] transition-opacity duration-500" />

                  <AnimatePresence mode="wait">
                    {addedAnim ? (
                      <motion.span
                        key="done"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative flex items-center justify-center gap-2 text-[11px] font-black tracking-[0.15em] uppercase"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Added!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="cta"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative flex items-center justify-center gap-2 text-[11px] font-black tracking-[0.15em] uppercase w-20"
                      >
                        Add to Cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* wishlist */}
                <motion.button
                  onClick={() => setWishlisted((v) => !v)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                    wishlisted
                      ? "border-red-200 bg-red-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <motion.svg
                    animate={wishlisted ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className={`w-[18px] h-[18px] transition-colors ${wishlisted ? "text-red-500" : "text-gray-400"}`}
                    fill={wishlisted ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </motion.svg>
                </motion.button>
              </div>

              {/* delivery estimate inline */}
              <div className="flex items-center gap-2 mt-4 text-[11px] text-emerald-700 font-semibold">
                <svg
                  className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1 2 1 2-1 2 1 2-1zm7-3v4a1 1 0 01-1 1h-1m-6 0h6m-6 0H9m11-4l-3-4h-3v4"
                  />
                </svg>
                Free delivery · Arrives{" "}
                <span className="font-black">Wed, Mar 7</span>
              </div>
            </motion.div>

            {/* ── device compatibility (collapsible) ── */}
            {productData.sizes && productData.sizes.length > 0 && (
              <motion.div
                custom={5}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-4"
              >
                <button
                  onClick={() => setCompatOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-violet-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] font-black tracking-[0.15em] uppercase text-gray-700">
                        Device Compatibility
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {size
                          ? `Selected: ${size}`
                          : "Optional — works with all listed models"}
                      </p>
                    </div>
                  </div>
                  <motion.svg
                    animate={{ rotate: compatOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {compatOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 pt-3 px-1">
                        {productData.sizes.map((s) => (
                          <motion.button
                            key={s}
                            onClick={() => setSize(s === size ? "" : s)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative px-3.5 py-2 rounded-lg text-[12px] font-bold transition-all duration-200 ${
                              s === size
                                ? "bg-[#1a1a1a] text-white shadow-md"
                                : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-400 hover:text-gray-700"
                            }`}
                          >
                            {s === size && (
                              <motion.div
                                layoutId="compat-pill"
                                className="absolute inset-0 rounded-lg bg-[#1a1a1a] -z-10"
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 28,
                                }}
                              />
                            )}
                            <span className="relative">{s}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ── trust strip ── */}
            <motion.div
              custom={6}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-3 gap-2.5 mt-4"
            >
              {[
                { icon: "🔄", label: "30-Day Returns" },
                { icon: "🛡️", label: "1-Year Warranty" },
                { icon: "✅", label: "MFi Certified" },
              ].map(({ icon, label }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-default"
                >
                  <span className="text-base">{icon}</span>
                  <p className="text-[9px] font-bold text-gray-600 leading-tight tracking-wide uppercase">
                    {label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* ── share row ── */}
            <motion.div
              custom={7}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100"
            >
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                Share
              </span>
              <div className="flex gap-2">
                {["twitter", "facebook", "link"].map((platform) => (
                  <button
                    key={platform}
                    className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors group"
                  >
                    {platform === "twitter" && (
                      <svg
                        className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    )}
                    {platform === "facebook" && (
                      <svg
                        className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    )}
                    {platform === "link" && (
                      <svg
                        className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ═══════════════════════════════════
            TABS SECTION
        ═══════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          {/* tab nav */}
          <div className="flex gap-0.5 p-1 bg-gray-100/80 rounded-2xl w-fit mb-10">
            {[
              { key: "description", label: "Description" },
              { key: "reviews", label: "Reviews (122)" },
              { key: "shipping", label: "Shipping" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative px-5 py-2.5 rounded-xl text-[12px] font-bold tracking-wide transition-all duration-200 ${
                  activeTab === key
                    ? "text-[#1a1a1a]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {activeTab === key && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200/50"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Description */}
            {activeTab === "description" && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl"
              >
                <div className="space-y-4 text-[13px] text-gray-500 leading-[1.8]">
                  <p>
                    Precision engineered for your device, this accessory
                    combines premium materials with thoughtful design. Whether
                    you need protection, charging capabilities, or enhanced
                    functionality, we've got you covered.
                  </p>
                  <p>
                    Every product undergoes rigorous testing to ensure
                    compatibility and performance. From drop protection to fast
                    charging speeds, our accessories are built to enhance your
                    daily tech experience.
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.25em] uppercase text-gray-400 mb-4">
                    Key Specifications
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      "Premium materials — durable and long-lasting",
                      "Precision cutouts for easy access to ports",
                      "Supports wireless charging (where applicable)",
                      "Slim profile design — only 1.2mm thin",
                      "Includes 1-year manufacturer warranty",
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-[13px] text-gray-600"
                      >
                        <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                          <svg
                            className="w-2 h-2 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="max-w-3xl"
              >
                {/* summary */}
                <div className="flex flex-col sm:flex-row items-start gap-8 p-6 rounded-2xl bg-[#fafaf8] border border-gray-100 mb-8">
                  <div className="text-center shrink-0">
                    <p className="text-5xl font-black text-[#1a1a1a] leading-none">
                      4.0
                    </p>
                    <div className="flex gap-0.5 justify-center mt-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} filled={s <= 4} />
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
                      122 verified
                    </p>
                  </div>
                  <div className="flex-1 w-full space-y-1.5">
                    {[
                      ["5★", "68%", 68],
                      ["4★", "18%", 18],
                      ["3★", "9%", 9],
                      ["2★", "3%", 3],
                      ["1★", "2%", 2],
                    ].map(([star, label, pct]) => (
                      <div
                        key={star}
                        className="flex items-center gap-2.5 text-[11px] text-gray-500"
                      >
                        <span className="w-5 shrink-0 font-semibold">
                          {star}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-amber-400 rounded-full"
                          />
                        </div>
                        <span className="w-7 text-right font-semibold text-[10px]">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* review cards */}
                <div className="space-y-0">
                  {[
                    {
                      name: "Sarah K.",
                      rating: 5,
                      date: "2 weeks ago",
                      verified: true,
                      text: "Perfect fit for my iPhone 15! The quality is excellent and it arrived quickly. Highly recommend.",
                    },
                    {
                      name: "James O.",
                      rating: 4,
                      date: "1 month ago",
                      verified: true,
                      text: "Great charger, works with my Samsung S24. Fast delivery and good packaging. Would buy again.",
                    },
                  ].map(({ name, rating, date, verified, text }, i) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="py-5 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                            {name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-[13px] font-bold text-gray-800">
                                {name}
                              </p>
                              {verified && (
                                <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-400">{date}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 shrink-0">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} filled />
                          ))}
                        </div>
                      </div>
                      <p className="text-[13px] text-gray-500 leading-relaxed pl-[42px]">
                        {text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Shipping */}
            {activeTab === "shipping" && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="max-w-3xl grid sm:grid-cols-2 gap-3"
              >
                {[
                  {
                    icon: "🚚",
                    title: "Standard Delivery",
                    body: "3–5 business days. Free on orders over $50.",
                  },
                  {
                    icon: "⚡",
                    title: "Express Delivery",
                    body: "1–2 business days. Flat rate $9.99.",
                  },
                  {
                    icon: "🔄",
                    title: "30-Day Returns",
                    body: "Full refund — no questions asked.",
                  },
                  {
                    icon: "📦",
                    title: "Warranty",
                    body: "1-year coverage against all defects.",
                  },
                ].map(({ icon, title, body }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -3 }}
                    className="p-5 rounded-2xl bg-[#fafaf8] border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    <span className="text-xl">{icon}</span>
                    <p className="text-[13px] font-bold text-[#1a1a1a] mt-2.5 mb-1">
                      {title}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {body}
                    </p>
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

      {/* ═══════════════════════════════════
          STICKY BOTTOM BAR (mobile + scroll)
      ═══════════════════════════════════ */}
      <AnimatePresence>
        {!ctaVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/60 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="max-w-screen-xl mx-auto px-5 py-3 flex items-center gap-3">
              {/* mini product info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={productData.image[0]}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-[#1a1a1a] truncate">
                    {productData.name}
                  </p>
                  <p className="text-[12px] font-black text-[#1a1a1a]">
                    {currency}
                    {productData.price}
                  </p>
                </div>
              </div>

              {/* sticky add to cart */}
              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.96 }}
                className="shrink-0 h-11 px-7 rounded-xl bg-[#1a1a1a] text-white text-[11px] font-black tracking-[0.12em] uppercase shadow-lg shadow-black/10 active:bg-gray-800 transition-colors"
              >
                <AnimatePresence mode="wait">
                  {addedAnim ? (
                    <motion.span
                      key="sticky-done"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Added!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="sticky-cta"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════
          LIGHTBOX
      ═══════════════════════════════════ */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 z-50 bg-black/94 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.img
              src={image}
              alt={productData.name}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="max-h-[88vh] max-w-full object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* lightbox thumbnails */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-md rounded-2xl p-2">
              {productData.image.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(img);
                  }}
                  whileHover={{ scale: 1.08 }}
                  className={`w-11 h-11 rounded-xl overflow-hidden border-2 transition-all ${
                    image === img
                      ? "border-white shadow-lg"
                      : "border-white/15 opacity-50 hover:opacity-100 hover:border-white/40"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>

            {/* close */}
            <motion.button
              onClick={() => setZoomed(false)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* shimmer keyframe for gradient button */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </motion.div>
  );
};

export default Product;
