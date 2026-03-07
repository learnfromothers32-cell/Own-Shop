import React, { useState } from "react";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";

const policies = [
  {
    icon: assets.exchange_icon,
    title: "Easy Exchange",
    subtitle: "Effortless Swaps",
    description:
      "Changed your mind? No stress. Swap any item for a different size or style — zero paperwork, zero hassle.",
    badge: "Free",
    stat: "100%",
    statLabel: "Hassle-free",
    color: "from-blue-50 to-indigo-50",
    darkColor: "from-blue-600 to-indigo-600",
    accent: "bg-blue-100 text-blue-600",
    border: "border-blue-200/60",
    glow: "bg-blue-400/10",
    dot: "bg-blue-400",
    ring: "ring-blue-200",
  },
  {
    icon: assets.quality_icon,
    title: "7-Day Returns",
    subtitle: "Shop Risk-Free",
    description:
      "Not in love with it? Send it back within 7 days for a full refund. We make the entire process completely painless.",
    badge: "No Fees",
    stat: "7",
    statLabel: "Day Window",
    color: "from-emerald-50 to-teal-50",
    darkColor: "from-emerald-500 to-teal-500",
    accent: "bg-emerald-100 text-emerald-600",
    border: "border-emerald-200/60",
    glow: "bg-emerald-400/10",
    dot: "bg-emerald-400",
    ring: "ring-emerald-200",
  },
  {
    icon: assets.support_img,
    title: "24/7 Support",
    subtitle: "Always Here",
    description:
      "Real humans, real answers — any time of day. Chat, email, or phone. We're on standby whenever you need us.",
    badge: "Live Chat",
    stat: "24/7",
    statLabel: "Availability",
    color: "from-violet-50 to-purple-50",
    darkColor: "from-violet-600 to-purple-600",
    accent: "bg-violet-100 text-violet-600",
    border: "border-violet-200/60",
    glow: "bg-violet-400/10",
    dot: "bg-violet-400",
    ring: "ring-violet-200",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 44, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.13, duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  }),
};

function OurPolicy() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="relative w-full overflow-hidden">
      {/* ── Dot-grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] z-0"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-12 xl:px-20 py-28">
        {/* ── Section header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "2.5rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-px bg-[#414141] block"
              />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400">
                Why Shop With Us
              </span>
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "2.5rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-px bg-[#414141] block"
              />
            </div>

            <h2 className="prata-regular text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] tracking-tight text-[#1a1a1a]">
              Our <span className="italic">Promise</span> to You
            </h2>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs font-light">
              Every order is backed by three guarantees that make shopping with
              us completely risk-free.
            </p>
          </motion.div>

          {/* Trust counter pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex items-center gap-4 bg-white border border-gray-100 shadow-sm rounded-2xl px-6 py-4 self-start"
          >
            <div className="flex -space-x-2.5">
              {[
                "bg-blue-300",
                "bg-emerald-300",
                "bg-violet-300",
                "bg-amber-300",
              ].map((c, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${c} border-2 border-white`}
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-bold text-[#1a1a1a]">
                50,000+ shoppers
              </p>
              <p className="text-[10px] text-gray-400 tracking-wide">
                trust us every month
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Marquee strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative w-full overflow-hidden border-y border-[#1a1a1a]/6 py-3 mb-14"
        >
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap w-max"
          >
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <span key={i} className="flex items-center">
                  {[
                    "Free Exchanges",
                    "7-Day Returns",
                    "24/7 Support",
                    "No Hidden Fees",
                    "100% Original",
                    "Risk-Free Shopping",
                  ].map((t) => (
                    <span key={t} className="flex items-center gap-6 px-8">
                      <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#414141]/30">
                        {t}
                      </span>
                      <span className="text-[#414141]/20 text-xs">◆</span>
                    </span>
                  ))}
                </span>
              ))}
          </motion.div>
        </motion.div>

        {/* ── Policy cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {policies.map((policy, i) => (
            <motion.div
              key={policy.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              whileHover={{
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className={`relative rounded-3xl bg-gradient-to-br ${policy.color} border ${policy.border} p-8 flex flex-col overflow-hidden cursor-default group`}
            >
              {/* Ambient blur circle */}
              <div
                className={`absolute -top-10 -right-10 w-40 h-40 rounded-full ${policy.glow} blur-2xl pointer-events-none`}
              />

              {/* Badge */}
              <span
                className={`absolute top-5 right-5 text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full ${policy.accent}`}
              >
                {policy.badge}
              </span>

              {/* Top row: icon + stat */}
              <div className="flex items-start justify-between mb-7 relative z-10">
                {/* Icon */}
                <motion.div
                  animate={hovered === i ? { rotate: [0, -10, 10, -5, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 flex items-center justify-center bg-white rounded-2xl shadow-sm ring-4 ${policy.ring}`}
                >
                  <img
                    src={policy.icon}
                    alt={policy.title}
                    className="w-7 h-7 object-contain"
                  />
                </motion.div>

                {/* Stat */}
                <div className="text-right">
                  <p className="text-2xl font-black text-[#1a1a1a] leading-none">
                    {policy.stat}
                  </p>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 mt-0.5">
                    {policy.statLabel}
                  </p>
                </div>
              </div>

              {/* Text */}
              <div className="relative z-10 flex-1">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-1.5">
                  {policy.subtitle}
                </p>
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 leading-snug">
                  {policy.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {policy.description}
                </p>
              </div>

              {/* Footer */}
              <div className="relative z-10 flex items-center justify-between mt-8 pt-5 border-t border-black/5">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${policy.dot}`} />
                  <span className="text-[10px] text-gray-400 font-semibold tracking-wide uppercase">
                    Always included
                  </span>
                </div>

                {/* Animated arrow on hover */}
                <AnimatePresence>
                  {hovered === i && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${policy.darkColor} flex items-center justify-center`}
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Watermark letter */}
              <div className="absolute -bottom-4 -right-3 text-[7rem] font-black text-[#1a1a1a]/[0.04] leading-none pointer-events-none select-none">
                {policy.title[0]}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-14 pt-10 border-t border-[#1a1a1a]/8"
        >
          <p className="text-xs text-gray-400 tracking-[0.25em] uppercase">
            Trusted by 50,000+ happy shoppers worldwide
          </p>

          <div className="flex items-center gap-6">
            {[
              { icon: "🔒", label: "Secure Checkout" },
              { icon: "🌍", label: "Worldwide Shipping" },
              { icon: "♻️", label: "Sustainable Packaging" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="text-sm">{icon}</span>
                <span className="text-[10px] font-semibold text-gray-400 tracking-wide hidden sm:block">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default OurPolicy;
