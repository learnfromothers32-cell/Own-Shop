import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
   DELIVERY PAGE  — matches BestSeller design system exactly
   · bg-[#fafaf8] warm white base
   · dot-grid texture + amber ambient glows
   · prata-regular display font
   · amber-500 accent, #1a1a1a dark
   · rounded-2xl cards with border-gray-100
   · same eyebrow pattern (animated lines + amber-500)
   · same bottom CTA strip + live indicator
───────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ── Shipping Row ─────────────────────────────────────────── */
const ShippingRow = ({ label, value, index, isFree }) => (
  <motion.li
    custom={index}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0 group"
  >
    <span className="text-sm text-gray-500 font-light group-hover:text-[#1a1a1a] transition-colors duration-300">
      {label}
    </span>
    <div className="flex items-center gap-2.5">
      {isFree && (
        <span className="text-[9px] font-black tracking-[0.2em] uppercase bg-amber-500 text-white px-2.5 py-1 rounded-full shadow-sm shadow-amber-500/30">
          FREE
        </span>
      )}
      <span className="font-bold text-[#1a1a1a] text-sm">{value}</span>
    </div>
  </motion.li>
);

/* ── Info Card ────────────────────────────────────────────── */
const InfoCard = ({ icon, eyebrow, headline, rows, freeRow, delay }) => (
  <motion.div
    custom={delay}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="relative flex flex-col gap-0 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
  >
    {/* amber top line — matches rank badge accent from BestSeller */}
    <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 to-orange-400" />

    <div className="px-7 pt-6 pb-2">
      {/* eyebrow */}
      <div className="flex items-center gap-3 mb-4">
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: "1.5rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay * 0.1 + 0.2 }}
          className="h-px bg-amber-500 block"
        />
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-amber-500">
          {eyebrow}
        </span>
      </div>

      <h3 className="prata-regular text-[clamp(1.5rem,3vw,2rem)] leading-tight tracking-tight text-[#1a1a1a] mb-1">
        {headline}
      </h3>
    </div>

    <ul className="px-7 pb-7 mt-2 list-none m-0 p-0 flex flex-col">
      {rows.map((r, i) => (
        <ShippingRow key={i} label={r.label} value={r.value} index={i} isFree={i === freeRow} />
      ))}
    </ul>
  </motion.div>
);

/* ── Policy Item ──────────────────────────────────────────── */
const PolicyItem = ({ num, text, index }) => (
  <motion.div
    custom={index}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="flex items-start gap-4 py-5 border-b border-[#1a1a1a]/6 last:border-0 group"
  >
    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[10px] font-black text-amber-500 mt-0.5">
      {num}
    </span>
    <p className="text-sm text-gray-500 leading-relaxed font-light m-0 group-hover:text-[#1a1a1a] transition-colors duration-300">
      {text}
    </p>
  </motion.div>
);

/* ── Main Component ───────────────────────────────────────── */
const Delivery = () => {
  const times = [
    { label: "Accra & Tema",         value: "1–2 business days" },
    { label: "Regional Capitals",    value: "2–3 business days" },
    { label: "Other Cities / Towns", value: "3–5 business days" },
    { label: "International",        value: "7–14 business days" },
  ];
  const costs = [
    { label: "Orders above ₵500", value: "₵0.00"   },
    { label: "Standard Shipping", value: "₵30.00"  },
    { label: "Express Shipping",  value: "₵50.00"  },
    { label: "International",     value: "₵200.00" },
  ];
  const policies = [
    "All orders are processed within 24 hours of payment confirmation.",
    "You'll receive a tracking number via email or SMS once your order ships.",
    "Delivery times are estimates and may vary during peak seasons.",
    "A signature may be required for orders exceeding ₵300.",
    "For international orders, customs fees may apply and are the buyer's responsibility.",
  ];
  const stats = [
    { value: "24h",  label: "Dispatch"  },
    { value: "5+",   label: "Regions"   },
    { value: "100%", label: "Tracked"   },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#fafaf8]">

      {/* ── Dot-grid texture — identical to BestSeller ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] z-0"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Ambient glows — identical to BestSeller ── */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-amber-400/5 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-300/[0.04] rounded-full blur-[110px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-12 xl:px-20 py-28">

        {/* ── Section header — mirrors BestSeller header layout ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow — exact same pattern */}
            <div className="flex items-center gap-3 mb-5">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "2.5rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-px bg-amber-500 block"
              />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-amber-500">
                Shipping Information
              </span>
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "2.5rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-px bg-amber-500 block"
              />
            </div>

            {/* Headline — prata-regular + italic span, same as BestSeller */}
            <h2 className="prata-regular text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] tracking-tight text-[#1a1a1a]">
              Delivery <span className="italic">Info</span>
            </h2>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs font-light">
              Carefully packed, thoughtfully dispatched — wherever you are in the world.
            </p>
          </motion.div>

          {/* Stats pill card — exact same component structure as BestSeller */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-stretch divide-x divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden self-start"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center px-6 py-4 gap-0.5">
                <p className="text-lg sm:text-xl font-bold text-[#1a1a1a]">{value}</p>
                <p className="text-[9px] tracking-[0.25em] uppercase text-gray-400">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Marquee strip — same as BestSeller ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative w-full overflow-hidden border-y border-[#1a1a1a]/6 py-3 mb-14"
        >
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap w-max"
          >
            {Array(4).fill(null).map((_, i) => (
              <span key={i} className="flex items-center">
                {["Free Shipping", "Tracked Delivery", "Nationwide", "International", "24hr Dispatch", "Signature Service"].map((t) => (
                  <span key={t} className="flex items-center gap-6 px-8">
                    <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#414141]/30">
                      {t}
                    </span>
                    <span className="text-amber-400/50 text-xs">◆</span>
                  </span>
                ))}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Info Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <InfoCard eyebrow="Transit Times" headline="Shipping Times" rows={times} delay={0} />
          <InfoCard eyebrow="Rate Schedule" headline="Shipping Costs" rows={costs} freeRow={0} delay={1} />
        </div>

        {/* ── Delivery Policy block ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mt-5"
        >
          {/* amber top line */}
          <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 to-orange-400" />

          <div className="px-7 pt-6 pb-2">
            <div className="flex items-center gap-3 mb-4">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "2.5rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-px bg-amber-500 block"
              />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-amber-500">
                Policy Guidelines
              </span>
            </div>
            <h3 className="prata-regular text-[clamp(1.5rem,3vw,2rem)] leading-tight tracking-tight text-[#1a1a1a]">
              Delivery <span className="italic">Policy</span>
            </h3>
          </div>

          <div className="px-7 pb-7 mt-2">
            {policies.map((text, i) => (
              <PolicyItem key={i} num={i + 1} text={text} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── Bottom CTA strip — exact same as BestSeller ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-14 pt-10 border-t border-[#1a1a1a]/8"
        >
          {/* Live indicator */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-2.5 h-2.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-amber-400 opacity-60 animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <p className="text-xs font-semibold text-[#1a1a1a]">
              Rates updated regularly · Always accurate
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link to="/collection">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden flex items-center gap-3 px-9 py-3.5 rounded-full bg-[#1a1a1a] text-white text-[11px] font-bold tracking-[0.25em] uppercase"
              >
                <motion.span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative">Shop Now</span>
                <motion.span
                  className="relative"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </motion.button>
            </Link>

            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-9 py-3.5 border-2 border-gray-200 text-gray-500 text-[11px] font-bold tracking-[0.25em] uppercase rounded-full hover:border-gray-400 hover:text-gray-800 transition-all"
              >
                Contact Us
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Delivery;