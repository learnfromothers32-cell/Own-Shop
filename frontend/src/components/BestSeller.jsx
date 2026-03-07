import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ProductsItem from "./ProductsItem";

const RANKS = ["#1 Pick", "#2", "#3", "#4", "#5"];

const proofStats = [
  { value: "98%", label: "Recommend" },
  { value: "12k+", label: "Reviews" },
  { value: "#1", label: "Trending" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

function BestSeller() {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const best = products.filter((item) => item.bestSeller);
    setBestSeller(best.slice(0, 10));
  }, [products]);

  const [hero, ...rest] = bestSeller;

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
      <div className="absolute bottom-0 left-0  w-[500px] h-[500px] bg-amber-300/4 rounded-full blur-[110px] pointer-events-none z-0" />

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
                className="h-px bg-amber-500 block"
              />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-amber-500">
                Customer Favourites
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
              Best <span className="italic">Sellers</span>
            </h2>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs font-light">
              The pieces flying off shelves since the moment they dropped.
            </p>
          </motion.div>

          {/* Stats pill card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-stretch divide-x divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden self-start"
          >
            {proofStats.map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center px-6 py-4 gap-0.5"
              >
                <p className="text-lg sm:text-xl font-bold text-[#1a1a1a]">
                  {value}
                </p>
                <p className="text-[9px] tracking-[0.25em] uppercase text-gray-400">
                  {label}
                </p>
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
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <span key={i} className="flex items-center">
                  {[
                    "Best Sellers",
                    "Spring 2025",
                    "12k+ Reviews",
                    "As Seen On",
                    "Customer Favourites",
                    "Flying Off Shelves",
                  ].map((t) => (
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

        {/* ══════════════════════════════════════
            EDITORIAL LAYOUT:
            Left  → #1 Hero card (tall, featured)
            Right → 2 × 2 grid of #2 – #5
        ══════════════════════════════════════ */}
        {bestSeller.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.72fr] gap-5">
            {/* ── #1 HERO CARD ── */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onHoverStart={() => setHovered(hero?._id)}
              onHoverEnd={() => setHovered(null)}
              className="relative group"
            >
              {/* Outer glow on hover */}
              <AnimatePresence>
                {hovered === hero?._id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -inset-3 rounded-3xl bg-amber-400/8 border border-amber-300/30 pointer-events-none z-0"
                  />
                )}
              </AnimatePresence>

              <div className="relative z-10 flex flex-col h-full">
                {/* Image wrapper — taller on desktop */}
                <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4] lg:aspect-auto lg:flex-1">
                  {/* Rank badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.6,
                      type: "spring",
                      stiffness: 380,
                      damping: 22,
                    }}
                    className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-amber-500 text-white text-[10px] font-black tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full shadow-lg shadow-amber-500/30"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                    #1 Best Seller
                  </motion.div>

                  {/* Watermark */}
                  <div className="absolute bottom-4 right-4 text-[8rem] font-black text-white/10 leading-none pointer-events-none select-none z-10">
                    1
                  </div>

                  {hero && (
                    <Link to={`/product/${hero._id}`}>
                      <motion.img
                        src={
                          Array.isArray(hero.image) ? hero.image[0] : hero.image
                        }
                        alt={hero.name}
                        className="w-full h-full object-cover object-top"
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </Link>
                  )}

                  {/* Bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-10" />

                  {/* Info overlay inside image */}
                  {hero && (
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
                      <p className="text-white/60 text-[10px] tracking-widest uppercase font-semibold">
                        {hero.category}
                      </p>
                      <p className="text-white font-semibold text-base leading-snug mt-1">
                        {hero.name}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-white font-bold text-lg">
                          {hero.currency}
                          {hero.price}
                        </p>
                        <div className="flex items-center gap-0.5">
                          {Array(5)
                            .fill(null)
                            .map((_, i) => (
                              <svg
                                key={i}
                                className="w-3 h-3 text-amber-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ── #2 – #5 GRID (2 × 2) ── */}
            <div className="grid grid-cols-2 gap-5">
              {rest.map((item, i) => (
                <motion.div
                  key={item._id}
                  custom={i + 1}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  onHoverStart={() => setHovered(item._id)}
                  onHoverEnd={() => setHovered(null)}
                  className="relative group"
                >
                  {/* Hover glow */}
                  <AnimatePresence>
                    {hovered === item._id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute -inset-2 rounded-2xl bg-amber-400/6 border border-amber-200/30 pointer-events-none z-0"
                      />
                    )}
                  </AnimatePresence>

                  <div className="relative z-10">
                    {/* Rank badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        delay: (i + 1) * 0.1 + 0.5,
                        type: "spring",
                        stiffness: 380,
                        damping: 22,
                      }}
                      className="absolute -top-2 -left-2 z-20 text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full shadow-md pointer-events-none bg-[#1a1a1a] text-white"
                    >
                      {RANKS[i + 1]}
                    </motion.div>

                    {/* Watermark */}
                    <div className="absolute bottom-12 right-2 text-[3.5rem] font-black text-[#1a1a1a]/[0.04] leading-none pointer-events-none select-none z-0">
                      {i + 2}
                    </div>

                    <ProductsItem
                      id={item._id}
                      name={item.name}
                      image={item.image}
                      price={item.price}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── Bottom CTA strip ── */}
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
              Updated in real time · Last refreshed just now
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
                <span className="relative">Shop Best Sellers</span>
                <motion.span
                  className="relative"
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  →
                </motion.span>
              </motion.button>
            </Link>

            <Link to="/collection">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-9 py-3.5 border-2 border-gray-200 text-gray-500 text-[11px] font-bold tracking-[0.25em] uppercase rounded-full hover:border-gray-400 hover:text-gray-800 transition-all"
              >
                View All
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default BestSeller;
