import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

const faqs = [
  {
    category: "Orders",
    question: "How do I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order by logging into your account and viewing your order history.",
  },
  {
    category: "Returns",
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unworn items in original packaging. Simply initiate a return through your account or contact our support team.",
  },
  {
    category: "Shipping",
    question: "How long does shipping take?",
    answer: "Delivery times vary by location: Accra & Tema (1–2 days), Regional Capitals (2–3 days), Other Cities (3–5 days), International (7–14 days).",
  },
  {
    category: "Shipping",
    question: "Do you ship internationally?",
    answer: "Yes! We ship to over 35 countries worldwide. Shipping costs and delivery times vary by destination. Customs fees may apply and are the buyer's responsibility.",
  },
  {
    category: "Stock",
    question: "How do I know if an item is in stock?",
    answer: "Items shown on our website are in stock unless marked 'Out of Stock'. You can also contact us directly to check availability on specific items.",
  },
  {
    category: "Orders",
    question: "Can I change or cancel my order?",
    answer: "Orders can be modified or cancelled within 1 hour of placement. After that, please contact customer support as soon as possible for assistance.",
  },
  {
    category: "Payments",
    question: "What payment methods do you accept?",
    answer: "We accept Mobile Money (MoMo), Visa, Mastercard, and bank transfers. All payments are processed securely with SSL encryption.",
  },
  {
    category: "Payments",
    question: "How do I use a discount code?",
    answer: "Enter your discount code at checkout in the 'Promo Code' field. The discount will be applied automatically to your total before payment.",
  },
];

/* ── FAQ Item ─────────────────────────────────────────────── */
const FAQItem = ({ faq, index, isOpen, onToggle }) => (
  <motion.div
    custom={index}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
  >
    <button
      onClick={onToggle}
      className={`
        w-full text-left rounded-2xl border transition-all duration-300 overflow-hidden
        ${isOpen
          ? "border-amber-200 bg-white shadow-sm shadow-amber-100"
          : "border-gray-100 bg-white hover:border-amber-200 hover:shadow-sm"
        }
      `}
    >
      {/* amber top bar — only visible when open */}
      <div
        className={`h-[3px] w-full bg-gradient-to-r from-amber-400 to-orange-400 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      <div className="flex items-center justify-between px-6 py-5 gap-4">
        <div className="flex items-center gap-4">
          {/* category pill */}
          <span className="hidden sm:inline-flex text-[9px] font-bold tracking-[0.25em] uppercase text-amber-500 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full whitespace-nowrap">
            {faq.category}
          </span>
          <span className={`font-semibold text-sm leading-snug transition-colors duration-200 ${isOpen ? "text-[#1a1a1a]" : "text-gray-600"}`}>
            {faq.question}
          </span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-colors duration-300 ${isOpen ? "bg-amber-500 border-amber-500 text-white" : "border-gray-200 text-gray-400"}`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-1 border-t border-gray-50">
              <p className="text-sm text-gray-400 leading-relaxed font-light">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  </motion.div>
);

/* ── Main Component ───────────────────────────────────────── */
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const stats = [
    { value: "8",    label: "Questions" },
    { value: "30d",  label: "Returns"   },
    { value: "35+",  label: "Countries" },
  ];

  const marqueeItems = ["Got Questions", "30-Day Returns", "Fast Shipping", "Secure Payments", "35+ Countries", "24hr Dispatch"];

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
                Got Questions?
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
              Frequently <span className="italic">Asked</span>
            </h2>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs font-light">
              Everything you need to know about orders, shipping, returns, and more.
            </p>
          </motion.div>

          {/* Stats pill — same as the rest of the design system */}
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

        {/* ── FAQ Accordion ── */}
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* ── Still have questions CTA card ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="max-w-3xl mx-auto mt-5 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
        >
          <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 to-orange-400" />
          <div className="px-7 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: "1.5rem" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-px bg-amber-500 block"
                />
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-amber-500">
                  Still Unsure?
                </span>
              </div>
              <h3 className="prata-regular text-xl text-[#1a1a1a] leading-snug">
                Can't find what you're <span className="italic">looking for?</span>
              </h3>
              <p className="text-xs text-gray-400 font-light mt-1">Our support team typically replies within a few hours.</p>
            </div>
            <Link to="/contact" className="flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#1a1a1a] text-white text-[11px] font-bold tracking-[0.25em] uppercase whitespace-nowrap"
              >
                <motion.span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative">Contact Support</span>
                <motion.span
                  className="relative"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* ── Bottom CTA strip ── */}
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
              Support available · Mon–Sat, 9am–6pm
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

export default FAQ;