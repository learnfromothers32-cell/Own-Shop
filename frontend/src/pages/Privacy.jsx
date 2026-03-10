import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const sections = [
  {
    eyebrow: "Data Collection",
    headline: "Information",
    headlineItalic: "We Collect",
    body: "We collect information you provide directly — your name, email address, phone number, and shipping address when you make a purchase or create an account. We also automatically collect certain information about your device and browsing behavior to improve your shopping experience.",
  },
  {
    eyebrow: "Data Usage",
    headline: "How We Use",
    headlineItalic: "Your Info",
    body: "We use your information to process orders, communicate with you about your purchases, send promotional offers (with your consent), and improve our website and services. We never sell your personal information to third parties.",
  },
  {
    eyebrow: "Tracking",
    headline: "Cookie",
    headlineItalic: "Policy",
    body: "We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings at any time without affecting your ability to shop.",
  },
  {
    eyebrow: "Protection",
    headline: "Data",
    headlineItalic: "Security",
    body: "We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology and handled by certified payment processors.",
  },
];

/* ── Policy Card ──────────────────────────────────────────── */
const PolicyCard = ({ eyebrow, headline, headlineItalic, body, index }) => (
  <motion.div
    custom={index}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
  >
    {/* amber top bar */}
    <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 to-orange-400" />

    <div className="px-7 py-6">
      {/* eyebrow */}
      <div className="flex items-center gap-3 mb-4">
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: "1.5rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          className="h-px bg-amber-500 block"
        />
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-amber-500">
          {eyebrow}
        </span>
      </div>

      <h3 className="prata-regular text-[clamp(1.4rem,2.5vw,1.75rem)] leading-tight tracking-tight text-[#1a1a1a] mb-4">
        {headline} <span className="italic">{headlineItalic}</span>
      </h3>

      <p className="text-sm text-gray-400 leading-relaxed font-light">{body}</p>
    </div>
  </motion.div>
);

/* ── Main Component ───────────────────────────────────────── */
const Privacy = () => {
  const stats = [
    { value: "SSL", label: "Encrypted"  },
    { value: "0",   label: "Data Sold"  },
    { value: "100%", label: "Secure"    },
  ];

  const marqueeItems = ["Your Privacy Matters", "SSL Encrypted", "Zero Data Sold", "GDPR Aligned", "Secure Checkout", "Trusted Platform"];

  return (
    <section className="relative w-full overflow-hidden bg-[#fafaf8]">

      {/* ── Dot-grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] z-0"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Ambient glows ── */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-amber-400/5 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-300/[0.04] rounded-full blur-[110px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-12 xl:px-20 py-28">

        {/* ── Section Header ── */}
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
                className="h-px bg-amber-500 block"
              />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-amber-500">
                Your Privacy Matters
              </span>
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "2.5rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-px bg-amber-500 block"
              />
            </div>

            <h2 className="prata-regular text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] tracking-tight text-[#1a1a1a]">
              Privacy <span className="italic">Policy</span>
            </h2>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs font-light">
              Transparent about what we collect, how we use it, and how we protect it.
            </p>
          </motion.div>

          {/* Stats pill — same as BestSeller / Delivery */}
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

        {/* ── Marquee strip ── */}
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
                {marqueeItems.map((t) => (
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

        {/* ── Policy Cards — 2×2 grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {sections.map((s, i) => (
            <PolicyCard key={i} {...s} index={i} />
          ))}
        </div>

        {/* ── Contact block ── */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mt-5"
        >
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
                Get In Touch
              </span>
            </div>
            <h3 className="prata-regular text-[clamp(1.4rem,2.5vw,1.75rem)] leading-tight tracking-tight text-[#1a1a1a] mb-4">
              Privacy <span className="italic">Questions?</span>
            </h3>
          </div>

          <div className="px-7 pb-8">
            <p className="text-sm text-gray-400 leading-relaxed font-light mb-6">
              If you have any questions about our privacy policy or how we handle your data, our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:asantekelvin229@gmail.com"
                className="group flex items-center gap-3 px-5 py-3 rounded-full border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all duration-300"
              >
                <span className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[11px] text-amber-500 flex-shrink-0">
                  @
                </span>
                <span className="text-[11px] font-semibold tracking-wide text-[#1a1a1a]">
                  asantekelvin229@gmail.com
                </span>
              </a>
              <a
                href="tel:+233538281749"
                className="group flex items-center gap-3 px-5 py-3 rounded-full border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all duration-300"
              >
                <span className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[11px] text-amber-500 flex-shrink-0">
                  ✆
                </span>
                <span className="text-[11px] font-semibold tracking-wide text-[#1a1a1a]">
                  +233 538-281-749
                </span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── Bottom CTA strip — identical to BestSeller / Delivery ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-14 pt-10 border-t border-[#1a1a1a]/8"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-2.5 h-2.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-amber-400 opacity-60 animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <p className="text-xs font-semibold text-[#1a1a1a]">
              Policy last updated · January 2025
            </p>
          </div>

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

export default Privacy;