import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Title from "./Title";
import ProductsItem from "./ProductsItem";

const FILTERS = ["All", "Cases", "Screen Protectors", "Chargers", "Cables", "Mounts", "Power Banks"];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function LatestCollection() {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [displayed, setDisplayed] = useState([]);


  useEffect(() => {
    const nonBestsellers = products.filter((item) => !item.bestSeller);

    const sortedByDate = [...nonBestsellers].sort((a, b) => b.date - a.date);
    setLatestProducts(sortedByDate.slice(0, 10));
  }, [products]);

  useEffect(() => {
    if (activeFilter === "All") {
      setDisplayed(latestProducts);
    } else {
      setDisplayed(latestProducts.filter((p) => p.category === activeFilter));
    }
  }, [activeFilter, latestProducts]);

  return (
    <section className="relative w-full overflow-hidden">
      {/* ── Subtle dot-grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] z-0"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-12 xl:px-20 py-24">
        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          {/* Left: eyebrow + title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "2.5rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-px bg-[#414141] block"
              />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#414141]/50">
                Fresh In
              </span>
            </div>

            <h2 className="prata-regular text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] tracking-tight text-[#1a1a1a]">
              Latest <span className="italic">Collection</span>
            </h2>

            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-sm font-light">
              Handpicked silhouettes fresh off the runway — before they sell
              out.
            </p>
          </motion.div>

          {/* Right: filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {FILTERS.map((tag) => (
              <motion.button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.25em] uppercase transition-all duration-300 ${
                  activeFilter === tag
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-700 border border-gray-200 hover:border-gray-400 bg-white"
                }`}
              >
                {activeFilter === tag && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 bg-[#1a1a1a] rounded-full z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{tag}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* ── Marquee ticker ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative w-full overflow-hidden border-y border-[#1a1a1a]/8 py-3 mb-14"
        >
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap w-max gap-0"
          >
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <span key={i} className="flex items-center">
                  {[
                    "New Arrivals",
                    "Spring 2026",
                    "Free Delivery",
                    "50k+ Customers",
                    "Ethically Made",
                    "Members Get 20% Off",
                  ].map((t) => (
                    <span key={t} className="flex items-center gap-6 px-8">
                      <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#414141]/40">
                        {t}
                      </span>
                      <span className="text-[#414141]/20 text-xs">◆</span>
                    </span>
                  ))}
                </span>
              ))}
          </motion.div>
        </motion.div>

        {/* ── Product Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 gap-y-10"
          >
            {(displayed.length ? displayed : latestProducts).map(
              (item, idx) => (
                <motion.div
                  key={item._id}
                  variants={cardVariants}
                  className="group relative"
                >
                  {/* "New" badge on first 3 */}
                  {idx < 3 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: idx * 0.1 + 0.4,
                        type: "spring",
                        stiffness: 400,
                      }}
                      className="absolute top-2 left-2 z-10 bg-[#1a1a1a] text-white text-[8px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full pointer-events-none"
                    >
                      New
                    </motion.span>
                  )}
                  <ProductsItem
                    id={item._id}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                  />
                </motion.div>
              ),
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Empty state ── */}
        <AnimatePresence>
          {displayed.length === 0 && activeFilter !== "All" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-24 gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-500">
                No {activeFilter} pieces yet
              </p>
              <button
                onClick={() => setActiveFilter("All")}
                className="text-[11px] tracking-widest uppercase text-gray-400 hover:text-gray-700 transition-colors"
              >
                View All →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom strip: CTA + editorial stat ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-16 pt-10 border-t border-[#1a1a1a]/8"
        >
          {/* Left: social proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2.5">
              {[
                "bg-violet-300",
                "bg-amber-300",
                "bg-emerald-300",
                "bg-pink-300",
              ].map((c, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${c} border-2 border-white`}
                />
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-[#1a1a1a]">
                Loved by 50,000+
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <svg
                      key={i}
                      className="w-2.5 h-2.5 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                <span className="text-[10px] text-gray-400 ml-1">4.9 avg</span>
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <Link to="/collection">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden flex items-center gap-4 px-10 py-4 rounded-full bg-[#1a1a1a] text-white text-[11px] font-bold tracking-[0.3em] uppercase"
            >
              <motion.span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative">View Full Collection</span>
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
        </motion.div>
      </div>
    </section>
  );
}

export default LatestCollection;




















































// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/shopContext";
// import { motion, AnimatePresence } from "framer-motion";
// import { Link } from "react-router-dom";
// import Title from "./Title";
// import ProductsItem from "./ProductsItem";

// const FILTERS = ["All", "Women", "Men", "Kids", "Accessories"];

// const containerVariants = {
//   hidden: {},
//   visible: { transition: { staggerChildren: 0.07 } },
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 48, scale: 0.97 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
//   },
// };

// function LatestCollection() {
//   const { products } = useContext(ShopContext);
//   const [latestProducts, setLatestProducts] = useState([]);
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [displayed, setDisplayed] = useState([]);


//   useEffect(() => {
//     const nonBestsellers = products.filter((item) => !item.bestSeller);

//     const sortedByDate = [...nonBestsellers].sort((a, b) => b.date - a.date);
//     setLatestProducts(sortedByDate.slice(0, 10));
//   }, [products]);

//   useEffect(() => {
//     if (activeFilter === "All") {
//       setDisplayed(latestProducts);
//     } else {
//       setDisplayed(latestProducts.filter((p) => p.category === activeFilter));
//     }
//   }, [activeFilter, latestProducts]);

//   return (
//     <section className="relative w-full overflow-hidden">
//       {/* ── Subtle dot-grid texture ── */}
//       <div
//         className="absolute inset-0 pointer-events-none opacity-[0.025] z-0"
//         style={{
//           backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
//           backgroundSize: "32px 32px",
//         }}
//       />

//       <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-12 xl:px-20 py-24">
//         {/* ── Header ── */}
//         <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
//           {/* Left: eyebrow + title */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
//           >
//             <div className="flex items-center gap-3 mb-4">
//               <motion.span
//                 initial={{ width: 0 }}
//                 whileInView={{ width: "2.5rem" }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 className="h-px bg-[#414141] block"
//               />
//               <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#414141]/50">
//                 Fresh In
//               </span>
//             </div>

//             <h2 className="prata-regular text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] tracking-tight text-[#1a1a1a]">
//               Latest <span className="italic">Collection</span>
//             </h2>

//             <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-sm font-light">
//               Handpicked silhouettes fresh off the runway — before they sell
//               out.
//             </p>
//           </motion.div>

//           {/* Right: filter pills */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="flex flex-wrap gap-2"
//           >
//             {FILTERS.map((tag) => (
//               <motion.button
//                 key={tag}
//                 onClick={() => setActiveFilter(tag)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className={`relative px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.25em] uppercase transition-all duration-300 ${
//                   activeFilter === tag
//                     ? "text-white"
//                     : "text-gray-400 hover:text-gray-700 border border-gray-200 hover:border-gray-400 bg-white"
//                 }`}
//               >
//                 {activeFilter === tag && (
//                   <motion.span
//                     layoutId="filter-pill"
//                     className="absolute inset-0 bg-[#1a1a1a] rounded-full z-0"
//                     transition={{ type: "spring", stiffness: 380, damping: 28 }}
//                   />
//                 )}
//                 <span className="relative z-10">{tag}</span>
//               </motion.button>
//             ))}
//           </motion.div>
//         </div>

//         {/* ── Marquee ticker ── */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5 }}
//           className="relative w-full overflow-hidden border-y border-[#1a1a1a]/8 py-3 mb-14"
//         >
//           <motion.div
//             animate={{ x: ["0%", "-50%"] }}
//             transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
//             className="flex whitespace-nowrap w-max gap-0"
//           >
//             {Array(4)
//               .fill(null)
//               .map((_, i) => (
//                 <span key={i} className="flex items-center">
//                   {[
//                     "New Arrivals",
//                     "Spring 2026",
//                     "Free Delivery",
//                     "50k+ Customers",
//                     "Ethically Made",
//                     "Members Get 20% Off",
//                   ].map((t) => (
//                     <span key={t} className="flex items-center gap-6 px-8">
//                       <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#414141]/40">
//                         {t}
//                       </span>
//                       <span className="text-[#414141]/20 text-xs">◆</span>
//                     </span>
//                   ))}
//                 </span>
//               ))}
//           </motion.div>
//         </motion.div>

//         {/* ── Product Grid ── */}
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={activeFilter}
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             exit={{ opacity: 0, transition: { duration: 0.2 } }}
//             className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 gap-y-10"
//           >
//             {(displayed.length ? displayed : latestProducts).map(
//               (item, idx) => (
//                 <motion.div
//                   key={item._id}
//                   variants={cardVariants}
//                   className="group relative"
//                 >
//                   {/* "New" badge on first 3 */}
//                   {idx < 3 && (
//                     <motion.span
//                       initial={{ opacity: 0, scale: 0.7 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{
//                         delay: idx * 0.1 + 0.4,
//                         type: "spring",
//                         stiffness: 400,
//                       }}
//                       className="absolute top-2 left-2 z-10 bg-[#1a1a1a] text-white text-[8px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full pointer-events-none"
//                     >
//                       New
//                     </motion.span>
//                   )}
//                   <ProductsItem
//                     id={item._id}
//                     image={item.image}
//                     name={item.name}
//                     price={item.price}
//                   />
//                 </motion.div>
//               ),
//             )}
//           </motion.div>
//         </AnimatePresence>

//         {/* ── Empty state ── */}
//         <AnimatePresence>
//           {displayed.length === 0 && activeFilter !== "All" && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0 }}
//               className="flex flex-col items-center py-24 gap-4"
//             >
//               <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
//                 <svg
//                   className="w-6 h-6 text-gray-300"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.5"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
//                   />
//                 </svg>
//               </div>
//               <p className="text-sm font-semibold text-gray-500">
//                 No {activeFilter} pieces yet
//               </p>
//               <button
//                 onClick={() => setActiveFilter("All")}
//                 className="text-[11px] tracking-widest uppercase text-gray-400 hover:text-gray-700 transition-colors"
//               >
//                 View All →
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* ── Bottom strip: CTA + editorial stat ── */}
//         <motion.div
//           initial={{ opacity: 0, y: 24 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.65, delay: 0.15 }}
//           className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-16 pt-10 border-t border-[#1a1a1a]/8"
//         >
//           {/* Left: social proof */}
//           <div className="flex items-center gap-4">
//             <div className="flex -space-x-2.5">
//               {[
//                 "bg-violet-300",
//                 "bg-amber-300",
//                 "bg-emerald-300",
//                 "bg-pink-300",
//               ].map((c, i) => (
//                 <div
//                   key={i}
//                   className={`w-8 h-8 rounded-full ${c} border-2 border-white`}
//                 />
//               ))}
//             </div>
//             <div>
//               <p className="text-xs font-bold text-[#1a1a1a]">
//                 Loved by 50,000+
//               </p>
//               <div className="flex items-center gap-1 mt-0.5">
//                 {Array(5)
//                   .fill(null)
//                   .map((_, i) => (
//                     <svg
//                       key={i}
//                       className="w-2.5 h-2.5 text-amber-400"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 <span className="text-[10px] text-gray-400 ml-1">4.9 avg</span>
//               </div>
//             </div>
//           </div>

//           {/* Right: CTA */}
//           <Link to="/collection">
//             <motion.button
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//               className="group relative overflow-hidden flex items-center gap-4 px-10 py-4 rounded-full bg-[#1a1a1a] text-white text-[11px] font-bold tracking-[0.3em] uppercase"
//             >
//               <motion.span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//               <span className="relative">View Full Collection</span>
//               <motion.span
//                 className="relative"
//                 animate={{ x: [0, 4, 0] }}
//                 transition={{
//                   duration: 1.6,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 }}
//               >
//                 →
//               </motion.span>
//             </motion.button>
//           </Link>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// export default LatestCollection;





