import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopContext";
import Title from "./Title";
import ProductsItem from "./ProductsItem";

if (typeof document !== "undefined" && !document.getElementById("rp-kf")) {
  const s = document.createElement("style");
  s.id = "rp-kf";
  s.textContent = `
    @keyframes rp-shimmer {
      0%   { background-position: 0%   center; }
      100% { background-position: 300% center; }
    }
    @keyframes rp-orbit {
      from { transform: rotate(0deg)   translateX(20px) rotate(0deg);   }
      to   { transform: rotate(360deg) translateX(20px) rotate(-360deg);}
    }
    @keyframes rp-scan {
      0%   { left: -70%; }
      100% { left: 130%; }
    }
    @keyframes rp-fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    @keyframes rp-glow-pulse {
      0%, 100% { box-shadow: 0 0 28px 4px rgba(99,102,241,0.18); }
      50%       { box-shadow: 0 0 44px 8px rgba(99,102,241,0.38); }
    }

    .rp-title-shimmer {
      background: linear-gradient(
        100deg,
        #c4b5fd 0%,
        #f9a8d4 28%,
        #93c5fd 55%,
        #c4b5fd 80%,
        #f9a8d4 100%
      );
      background-size: 250% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: rp-shimmer 5s linear infinite;
    }
    .rp-orbit-dot {
      animation: rp-orbit 3s linear infinite;
    }
    .rp-scanline {
      animation: rp-scan 4s ease-in-out infinite;
    }
    .rp-card-stagger { animation: rp-fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
    .rp-card-stagger:nth-child(1) { animation-delay: 0.05s; }
    .rp-card-stagger:nth-child(2) { animation-delay: 0.12s; }
    .rp-card-stagger:nth-child(3) { animation-delay: 0.19s; }
    .rp-card-stagger:nth-child(4) { animation-delay: 0.26s; }
    .rp-card-stagger:nth-child(5) { animation-delay: 0.33s; }

    .rp-card:hover .rp-card-glow   { opacity: 1; }
    .rp-card:hover img              { transform: scale(1.06) translateY(-3px); filter: brightness(1.06) saturate(1.1); }
    .rp-card:hover .rp-quick-view  { opacity: 1; transform: translateX(-50%) translateY(0); }
    .rp-btn-glow                   { animation: rp-glow-pulse 2.8s ease-in-out infinite; }
  `;
  document.head.appendChild(s);
}

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setRelated(
        products
          .filter((i) => i.category === category && i.subCategory === subCategory)
          .slice(0, 5)
      );
    }
  }, [products, category, subCategory]);

  return (
    <section className="relative overflow-hidden my-24 px-1 pb-10">

      {/* ── Subtle ambient blobs ── */}
      <div className="absolute -z-10 w-[480px] h-[480px] rounded-full bg-violet-600   opacity-[0.07] blur-[110px] -top-24  left-[10%]" />
      <div className="absolute -z-10 w-[360px] h-[360px] rounded-full bg-rose-500     opacity-[0.07] blur-[110px] top-10    right-[5%]" />
      <div className="absolute -z-10 w-[260px] h-[260px] rounded-full bg-sky-500      opacity-[0.06] blur-[100px] bottom-0  left-1/2" />

      {/* ── Header ── */}
      <header className="relative z-10 flex flex-col items-center text-center mb-14 gap-3">

        {/* Orbit indicator */}
        <div className="relative w-10 h-10 rounded-full border border-dashed border-violet-400/30 flex items-center justify-center mb-1">
          <div className="w-[7px] h-[7px] rounded-full bg-violet-500/80" />
          <span
            className="rp-orbit-dot absolute w-[5px] h-[5px] rounded-full bg-fuchsia-400"
            style={{ boxShadow: "0 0 6px 1px rgba(232,121,249,0.7)" }}
          />
        </div>

        {/* Eyebrow */}
        <p className="text-[10px] font-semibold tracking-[5px] uppercase text-violet-400/70 -mb-1">
          Discover More
        </p>

        {/* Main heading */}
        <div className="rp-title-shimmer text-[clamp(26px,4.5vw,44px)] font-black tracking-[-0.5px] leading-none">
          <Title text1={"RELATED"} text2={"PRODUCTS"} />
        </div>

        {/* Ruled line */}
        <div className="flex items-center gap-3 w-full max-w-sm mt-1">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
          <div className="w-1 h-1 rounded-full bg-violet-400/50" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent" />
        </div>

        <p className="text-[12px] text-white/30 tracking-wide max-w-xs leading-relaxed">
          Hand-picked selections based on what you're viewing
        </p>
      </header>

      {/* ── Product grid ── */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {related.map((item) => (
          <div
            key={item._id}
            className="rp-card rp-card-stagger group relative rounded-2xl overflow-hidden
                       border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl
                       cursor-pointer"
            style={{
              transition: "transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s cubic-bezier(.22,1,.36,1), border-color .25s ease",
            }}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const glow = e.currentTarget.querySelector(".rp-card-glow");
              if (glow) glow.style.background = `radial-gradient(circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(139,92,246,0.14), transparent 60%)`;
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.025)";
              e.currentTarget.style.boxShadow = "0 24px 56px -12px rgba(109,40,217,0.35), 0 0 0 1px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
              e.currentTarget.style.borderColor = "";
            }}
          >
            {/* Cursor-tracked glow */}
            <div
              className="rp-card-glow absolute inset-0 z-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-300"
              style={{ background: "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.12), transparent 60%)" }}
            />

            {/* Subtle scanline shimmer */}
            <div
              className="rp-scanline absolute top-0 -left-[70%] w-[45%] h-full z-[1] pointer-events-none -skew-x-[18deg] opacity-60"
              style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent)" }}
            />

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px z-[3]"
              style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(232,121,249,0.4), transparent)" }}
            />

            {/* NEW badge */}
            <div className="absolute top-2.5 left-2.5 z-[4]
                            text-[8px] font-bold tracking-[1.8px] uppercase
                            px-2 py-[3px] rounded-full text-white/90
                            border border-white/10"
              style={{ background: "rgba(109,40,217,0.6)", backdropFilter: "blur(8px)" }}
            >
              Related
            </div>

            {/* Quick view on hover */}
            <div
              className="rp-quick-view absolute bottom-[72px] left-1/2 z-[4]
                         -translate-x-1/2 translate-y-2 opacity-0
                         text-[10px] font-semibold tracking-[1.5px] uppercase
                         text-white/90 px-4 py-[5px] rounded-full
                         border border-white/15 pointer-events-none
                         whitespace-nowrap transition-all duration-200"
              style={{
                background: "rgba(109,40,217,0.75)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 20px rgba(109,40,217,0.4)",
              }}
            >
              Quick View ↗
            </div>

            {/* ProductsItem */}
            <div className="relative z-[2] [&_img]:transition-all [&_img]:duration-500 [&_img]:ease-[cubic-bezier(.22,1,.36,1)]">
              <ProductsItem
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer CTA ── */}
      <footer className="relative z-10 flex flex-col items-center gap-3 mt-14">
        <button
          className="rp-btn-glow group flex items-center gap-2
                     text-white text-[11px] font-semibold tracking-[2.5px] uppercase
                     px-9 py-3.5 rounded-full border border-violet-400/25
                     transition-all duration-200 hover:scale-[1.05] hover:brightness-110 active:scale-95"
          style={{ background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 50%, #db2777 100%)" }}
        >
          <span>Browse All Similar</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </button>
        <p className="text-[10px] text-white/20 tracking-widest uppercase">
          {related.length} items curated for you
        </p>
      </footer>

    </section>
  );
};

export default RelatedProducts;