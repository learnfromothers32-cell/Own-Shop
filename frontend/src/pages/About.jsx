import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import NewsLatestBox from "../components/NewsLatestBox";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.33, 1, 0.68, 1] },
  }),
};

const stats = [
  { value: "2026", label: "Year Founded" },
  { value: "50k+", label: "Happy Customers" },
  { value: "120+", label: "Brands Curated" },
  { value: "4.9★", label: "Average Rating" },
];

const values = [
  {
    icon: "🏅",
    title: "Quality Assurance",
    body: "Every item in our catalogue is hand-reviewed by our team before it ever reaches you. We partner exclusively with manufacturers who meet our strict standards for materials, construction, and ethical production.",
    accent: "from-amber-50 to-yellow-50",
    dot: "bg-amber-400",
  },
  {
    icon: "⚡",
    title: "Effortless Convenience",
    body: "From one-click checkout to express delivery and hassle-free returns, we've eliminated every friction point so your entire experience — from browse to doorstep — feels seamless.",
    accent: "from-blue-50 to-indigo-50",
    dot: "bg-blue-400",
  },
  {
    icon: "💬",
    title: "Exceptional Support",
    body: "Real people, real answers. Our customer care team is available 7 days a week via live chat, email, and phone. We don't close a ticket until you're genuinely satisfied.",
    accent: "from-violet-50 to-purple-50",
    dot: "bg-violet-400",
  },
];

const timeline = [
  {
    year: "2023",
    event:
      "Forever was founded with a single rail of 40 pieces and a big vision.",
  },
  {
    year: "2024",
    event:
      "Reached 10,000 customers and launched our first exclusive capsule collection.",
  },
  {
    year: "2025",
    event: "Expanded to international shipping across 35 countries.",
  },
  {
    year: "2026",
    event:
      "Crossed 50,000 happy customers and launched our sustainability pledge.",
  },
];

const About = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 pb-0">
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center pt-12 border-t border-gray-100 mb-16"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "2.5rem" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[1.5px] bg-[#414141]"
          />
          <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-gray-400">
            Our Story
          </span>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "2.5rem" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[1.5px] bg-[#414141]"
          />
        </div>
        <div className="text-3xl sm:text-4xl">
          <Title text1={"ABOUT"} text2={"US"} />
        </div>
      </motion.div>

      {/* ── Story section ── */}
      <div className="flex flex-col md:flex-row gap-16 items-center mb-28">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
          className="w-full md:max-w-[460px] shrink-0 relative"
        >
          <div className="rounded-3xl overflow-hidden aspect-[4/5]">
            <motion.img
              src={assets.about}
              alt="About Forever"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>

          {/* Floating stat card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.4,
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
            className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl px-6 py-4 border border-gray-100"
          >
            <p className="text-3xl font-bold text-[#1a1a1a]">50k+</p>
            <p className="text-xs text-gray-400 tracking-widest uppercase mt-0.5">
              Happy Customers
            </p>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
          className="flex flex-col justify-center gap-6 text-gray-500 leading-relaxed md:w-1/2"
        >
          <p className="text-sm sm:text-base">
            Forever was born from a simple frustration — great fashion shouldn't
            require a personal stylist or an endless scroll. We set out to build
            a curated destination where every piece earns its place: timeless
            enough to wear for years, current enough to turn heads today.
          </p>
          <p className="text-sm sm:text-base">
            From our first 40-piece rail in a small Accra studio, we've grown
            into a global community of over 50,000 customers who share one
            belief — that how you dress is one of the most personal, powerful
            forms of self-expression.
          </p>

          <div className="rounded-2xl bg-[#0f0f0f] p-6 mt-2">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-violet-400 mb-2">
              Our Mission
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              To make intentional, high-quality fashion accessible to everyone —
              without compromise on ethics, sustainability, or style. We exist
              to help you dress with confidence, every single day.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Stats bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100 rounded-2xl overflow-hidden mb-28"
      >
        {stats.map(({ value, label }, i) => (
          <motion.div
            key={label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white py-10 flex flex-col items-center justify-center text-center"
          >
            <p className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
              {value}
            </p>
            <p className="text-[11px] tracking-widest uppercase text-gray-400 mt-1.5">
              {label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Why choose us ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "2.5rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[1.5px] bg-[#414141]"
          />
          <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-gray-400">
            The Forever Difference
          </span>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "2.5rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[1.5px] bg-[#414141]"
          />
        </div>
        <div className="text-2xl sm:text-3xl">
          <Title text1={"WHY"} text2={"CHOOSE US"} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-28">
        {values.map(({ icon, title, body, accent, dot }, i) => (
          <motion.div
            key={title}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className={`bg-gradient-to-br ${accent} rounded-3xl p-8 flex flex-col gap-4 cursor-default`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl">
              {icon}
            </div>
            <h3 className="text-base font-bold text-[#1a1a1a]">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
            <div className="flex items-center gap-1.5 mt-auto pt-2">
              <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                Our commitment
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Timeline ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-28"
      >
        <div className="text-center mb-12">
          <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-gray-400">
            How We Got Here
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-[#1a1a1a] mt-2">
            Our <span className="font-semibold">Journey</span>
          </h2>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-gray-100" />

          <div className="flex flex-col gap-8">
            {timeline.map(({ year, event }, i) => (
              <motion.div
                key={year}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-start gap-6"
              >
                <span className="w-20 shrink-0 text-right text-sm font-bold text-gray-400 pt-0.5">
                  {year}
                </span>
                <div className="relative flex items-center justify-center shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-[#1a1a1a] z-10" />
                </div>
                <p className="text-sm text-gray-500 leading-relaxed pt-0.5">
                  {event}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Newsletter ── */}
      <NewsLatestBox />
    </div>
  );
};

export default About;
