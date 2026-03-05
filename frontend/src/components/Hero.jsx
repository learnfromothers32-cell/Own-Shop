import React, { useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

const Hero = () => {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const { scrollY } = useScroll();
  const imageY      = useTransform(scrollY, [0, 600], [0, 80]);
  const textY       = useTransform(scrollY, [0, 600], [0, -40]);
  const opacity     = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const handleMouse = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth  - 0.5) * 20);
      mouseY.set((e.clientY / innerHeight - 0.5) * 20);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#f8f6f1] overflow-hidden flex flex-col sm:flex-row"
    >

      {/* ── Decorative grid overlay ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Rotating ring ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full border border-[#414141]/10 pointer-events-none z-0"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        className="absolute -top-16 -left-16 w-[370px] h-[370px] rounded-full border border-[#414141]/8 pointer-events-none z-0"
      />

      {/* ══════════════════════════════
          LEFT — TEXT PANEL
      ══════════════════════════════ */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full sm:w-[52%] flex flex-col justify-between py-16 sm:py-24 px-8 md:px-16 xl:px-24"
      >

        {/* Top label row */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-[#414141]/50" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#414141]/50">
              SS — 2026
            </span>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 opacity-20"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                id="circle"
                d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="none"
              />
              <text fontSize="13" fontWeight="600" letterSpacing="6" fill="#414141">
                <textPath href="#circle">FOREVER • NEW ARRIVALS •</textPath>
              </text>
            </svg>
          </motion.div>
        </motion.div>

        {/* Main headline */}
        <div className="flex flex-col gap-0 my-auto pt-12 pb-8">

          {/* Serif large headline */}
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="prata-regular text-[clamp(3.5rem,8vw,7rem)] leading-[0.95] tracking-tight text-[#1a1a1a]"
            >
              The
            </motion.p>
          </div>
          <div className="overflow-hidden flex items-end gap-5">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="prata-regular text-[clamp(3.5rem,8vw,7rem)] leading-[0.95] tracking-tight text-[#1a1a1a] italic"
            >
              New
            </motion.p>
            {/* Year badge inline */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="hidden sm:flex mb-3 text-[11px] font-bold tracking-[0.2em] uppercase text-white bg-[#1a1a1a] px-3 py-1.5 rounded-full"
            >
              2025
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="prata-regular text-[clamp(3.5rem,8vw,7rem)] leading-[0.95] tracking-tight text-[#1a1a1a]"
            >
              Standard.
            </motion.p>
          </div>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
            className="mt-8 text-sm text-[#414141]/60 leading-relaxed max-w-xs font-light"
          >
            Timeless silhouettes, premium fabrics, and craftsmanship
            built to outlast every passing trend.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: "easeOut" }}
            className="flex items-center gap-6 mt-10"
          >
            <Link to="/collection">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden bg-[#1a1a1a] text-white text-[11px] font-bold tracking-[0.3em] uppercase px-10 py-4 rounded-full"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <span className="relative">Shop Collection</span>
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ gap: "1.25rem" }}
              className="flex items-center gap-3 text-[11px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
            >
              <span>Our Story</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>
        </div>

        {/* Bottom stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
          className="flex items-center gap-0 border-t border-[#1a1a1a]/10 pt-8"
        >
          {[
            { value: "200+", label: "New Styles" },
            { value: "50k+", label: "Customers" },
            { value: "4.9★", label: "Rating" },
          ].map(({ value, label }, i) => (
            <React.Fragment key={label}>
              <div className="flex-1 text-center first:text-left last:text-right">
                <p className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">{value}</p>
                <p className="text-[10px] text-[#414141]/40 tracking-[0.25em] uppercase mt-0.5">{label}</p>
              </div>
              {i < 2 && <div className="w-px h-8 bg-[#1a1a1a]/10" />}
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════
          RIGHT — IMAGE PANEL
      ══════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
        animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 1.1, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
        className="relative w-full sm:w-[48%] min-h-[70vw] sm:min-h-screen overflow-hidden"
      >
        {/* Parallax image */}
        <motion.div
          style={{ y: imageY, x: springX, rotateY: useTransform(springX, [-10, 10], [-1, 1]) }}
          className="absolute inset-[-5%] w-[110%] h-[110%]"
        >
          <img
            src={assets.hero_img}
            alt="Latest Arrivals"
            className="w-full h-full object-cover object-top"
          />
        </motion.div>

        {/* Dark gradient overlay — bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />

        {/* Left edge fade into left panel */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#f8f6f1] to-transparent z-20" />

        {/* Floating editorial tag — top right */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="absolute top-8 right-8 z-20 flex flex-col items-end gap-1"
        >
          <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/60">
            Featured
          </span>
          <span className="text-xs font-semibold text-white">Spring Edit</span>
        </motion.div>

        {/* Floating card — bottom left */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 1.2, type: "spring", stiffness: 200, damping: 20 }}
          style={{ x: springX, y: useTransform(springY, (v) => v * 0.5) }}
          className="absolute bottom-8 left-8 z-20 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-4 rounded-2xl shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["bg-violet-300", "bg-amber-300", "bg-emerald-300"].map((c, i) => (
                <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white/30`} />
              ))}
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-tight">+2,300 sold</p>
              <p className="text-white/50 text-[10px]">this week alone</p>
            </div>
          </div>
        </motion.div>

        {/* Vertical text label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-20 hidden lg:flex"
          style={{ writingMode: "vertical-rl" }}
        >
          <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-white/30">
            Forever — Collection 2025
          </span>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="absolute bottom-8 right-8 z-20 hidden sm:flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-white/60" />
          </motion.div>
          <span className="text-[9px] tracking-[0.3em] uppercase text-white/30 font-medium">Scroll</span>
        </motion.div>
      </motion.div>

    </section>
  );
};

export default Hero;