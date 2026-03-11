import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

/* ── Font Injection ───────────────────────────────────────────────── */
const injectFonts = () => {
  if (document.getElementById("add-fonts")) return;
  const link = document.createElement("link");
  link.id = "add-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap";
  document.head.appendChild(link);
};

/* ── Constants ────────────────────────────────────────────────────── */
const ACCESSORY_CATEGORIES = [
  "Cases", "Screen Protectors", "Chargers", "Cables",
  "Mounts", "Power Banks", "Headphones", "Earphones",
  "Smart Watches",
];
const DEVICE_COMPATIBILITY = [
  "iPhone", "Samsung", "Google Pixel", "AirPods",
  "iPad", "MacBook", "Apple Watch", "Universal",
];

/* ── Section fade-up ──────────────────────────────────────────────── */
const sectionAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ── Field label ──────────────────────────────────────────────────── */
const Label = ({ children }) => (
  <span
    className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-1 block"
    style={{ fontFamily: "'JetBrains Mono', monospace" }}
  >
    {children}
  </span>
);

/* ── Input base classes ───────────────────────────────────────────── */
const inputCls =
  "w-full border border-slate-200 rounded-xl py-2.5 px-3.5 text-[13px] text-slate-700 placeholder:text-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all duration-200";

/* ── Card wrapper ─────────────────────────────────────────────────── */
const Card = ({ children, accent, className = "" }) => (
  <div className={`relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden ${className}`}>
    {accent && <div className={`absolute top-0 left-0 right-0 h-[2px] ${accent}`} />}
    <div className="p-6">{children}</div>
  </div>
);

/* ── Card section header ──────────────────────────────────────────── */
const CardHeader = ({ label, description }) => (
  <div className="mb-5">
    <p
      className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-400"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {label}
    </p>
    {description && (
      <p className="text-[12px] text-slate-500 mt-0.5 font-medium"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {description}
      </p>
    )}
  </div>
);

/* ── Image Upload Slot ────────────────────────────────────────────── */
const ImageSlot = ({ state, setter, index }) => (
  <motion.label
    htmlFor={`img-${index}`}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className="relative cursor-pointer group block"
  >
    <div
      className={`w-[88px] h-[88px] rounded-xl overflow-hidden border-2 flex items-center justify-center transition-all duration-200
        ${state
          ? "border-slate-900 bg-slate-50"
          : "border-dashed border-slate-200 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50"
        }`}
    >
      {state ? (
        <img src={URL.createObjectURL(state)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="flex flex-col items-center gap-1.5 text-slate-300 group-hover:text-slate-400 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span className="text-[9px] font-bold tracking-wider uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {index + 1}
          </span>
        </div>
      )}
    </div>

    {/* check badge */}
    <AnimatePresence>
      {state && (
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center"
        >
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>

    {/* remove on hover */}
    <AnimatePresence>
      {state && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0, scale: 1 }}
          whileHover={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => { e.preventDefault(); setter(false); }}
          className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center"
        >
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>

    <input type="file" id={`img-${index}`} hidden onChange={(e) => setter(e.target.files[0])} />
  </motion.label>
);

/* ── Device Chip ──────────────────────────────────────────────────── */
const DeviceChip = ({ label, active, onClick }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className={`relative px-3.5 py-2 rounded-lg border text-[11px] font-bold tracking-wide transition-all duration-200
      ${active
        ? "bg-slate-900 border-slate-900 text-white"
        : "bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"
      }`}
    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
  >
    {label}
    <AnimatePresence>
      {active && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center"
        >
          <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </motion.span>
      )}
    </AnimatePresence>
  </motion.button>
);

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════ */
function Add({ token }) {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice]             = useState("");
  const [category, setCategory]       = useState("Cases");
  const [subCategory, setSubCategory] = useState("iPhone");
  const [bestSeller, setBestSeller]   = useState(false);
  const [sizes, setSizes]             = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { injectFonts(); }, []);

  const images = [
    { state: image1, setter: setImage1 },
    { state: image2, setter: setImage2 },
    { state: image3, setter: setImage3 },
    { state: image4, setter: setImage4 },
  ];
  const uploadedCount = images.filter(({ state }) => state).length;

  const toggleSize = (device) =>
    setSizes((prev) => prev.includes(device) ? prev.filter((s) => s !== device) : [...prev, device]);

  const resetForm = () => {
    setName(""); setDescription(""); setPrice("");
    setCategory("Cases"); setSubCategory("iPhone");
    setBestSeller(false); setSizes([]);
    setImage1(false); setImage2(false); setImage3(false); setImage4(false);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller);
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const { data } = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } });
      if (data.success) { toast.success(data.message); resetForm(); }
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── STICKY COMMAND BAR ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-slate-900">Products</span>
              <span className="text-slate-300">/</span>
              <span className="text-[13px] text-slate-400 font-medium">Add New</span>
            </div>
          </div>

          {/* progress indicator */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {uploadedCount}/4 images
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">

        {/* ── PAGE TITLE ── */}
        <motion.div
          custom={0} variants={sectionAnim} initial="hidden" animate="visible"
          className="mb-8"
        >
          <h1 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold text-slate-900 tracking-tight leading-none">
            Add Product
          </h1>
          <p className="text-[13px] text-slate-400 mt-1.5 font-medium">
            Fill in the details below to publish a new accessory.
          </p>
        </motion.div>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">

          {/* ── 01 IMAGES ── */}
          <motion.div custom={0.05} variants={sectionAnim} initial="hidden" animate="visible">
            <Card accent="bg-blue-500">
              <CardHeader label="01 · Product Images" description="Upload up to 4 product photos" />

              <div className="flex gap-3 flex-wrap">
                {images.map(({ state, setter }, i) => (
                  <ImageSlot key={i} state={state} setter={setter} index={i} />
                ))}
              </div>

              {/* upload progress bar */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Upload progress
                  </span>
                  <span className="text-[9px] font-bold text-slate-400"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {uploadedCount} / 4
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(uploadedCount / 4) * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ── 02 PRODUCT DETAILS ── */}
          <motion.div custom={0.1} variants={sectionAnim} initial="hidden" animate="visible">
            <Card accent="bg-violet-500">
              <CardHeader label="02 · Product Details" description="Name and description of the accessory" />

              <div className="flex flex-col gap-4">
                <div>
                  <Label>Product Name</Label>
                  <input
                    type="text"
                    placeholder="e.g. Premium Silicone Case for iPhone 15"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <textarea
                    rows={3}
                    placeholder="Describe materials, compatibility, key features…"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ── 03 CATEGORY & PRICING ── */}
          <motion.div custom={0.15} variants={sectionAnim} initial="hidden" animate="visible">
            <Card accent="bg-amber-400">
              <CardHeader label="03 · Category & Pricing" description="Classify the product and set its price" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Accessory Type</Label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`${inputCls} appearance-none pr-8 cursor-pointer`}
                    >
                      {ACCESSORY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div>
                  <Label>Compatibility</Label>
                  <div className="relative">
                    <select
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      className={`${inputCls} appearance-none pr-8 cursor-pointer`}
                    >
                      {DEVICE_COMPATIBILITY.map((d) => <option key={d}>{d}</option>)}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div>
                  <Label>Price (₵)</Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] font-bold pointer-events-none"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      ₵
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={`${inputCls} pl-7`}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ── 04 COMPATIBLE DEVICES ── */}
          <motion.div custom={0.2} variants={sectionAnim} initial="hidden" animate="visible">
            <Card accent="bg-emerald-500">
              <CardHeader
                label="04 · Compatible Devices"
                description={`${sizes.length} selected${sizes.length > 0 ? " · " + sizes.join(", ") : ""}`}
              />

              <div className="flex gap-2 flex-wrap">
                {DEVICE_COMPATIBILITY.map((device) => (
                  <DeviceChip
                    key={device}
                    label={device}
                    active={sizes.includes(device)}
                    onClick={() => toggleSize(device)}
                  />
                ))}
              </div>
            </Card>
          </motion.div>

          {/* ── 05 VISIBILITY ── */}
          <motion.div custom={0.25} variants={sectionAnim} initial="hidden" animate="visible">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-slate-900">Add to Bestsellers</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    Feature this product in the homepage bestseller section
                  </p>
                </div>

                {/* toggle */}
                <button
                  type="button"
                  onClick={() => setBestSeller((p) => !p)}
                  className={`relative w-11 h-6 rounded-full border-2 flex-shrink-0 transition-all duration-300
                    ${bestSeller ? "bg-slate-900 border-slate-900" : "bg-white border-slate-300 hover:border-slate-400"}`}
                >
                  <motion.div
                    animate={{ x: bestSeller ? 19 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`absolute top-0.5 w-4 h-4 rounded-full transition-colors duration-200
                      ${bestSeller ? "bg-white" : "bg-slate-300"}`}
                  />
                </button>
              </div>
            </Card>
          </motion.div>

          {/* ── SUBMIT ── */}
          <motion.div custom={0.3} variants={sectionAnim} initial="hidden" animate="visible">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.015 } : {}}
              whileTap={!isSubmitting ? { scale: 0.985 } : {}}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white text-[11px] font-bold tracking-[0.25em] uppercase py-4 rounded-2xl hover:bg-slate-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publishing…
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5">
                    Publish Accessory
                    <motion.svg
                      className="w-4 h-4"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <p className="text-center text-[10px] text-slate-400 mt-3 font-medium"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Product will be live in the store immediately after publishing.
            </p>
          </motion.div>

        </form>
      </div>
    </div>
  );
}

export default Add;