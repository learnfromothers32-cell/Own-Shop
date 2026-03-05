import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopContext";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import Title from "../components/Title";
import ProductsItem from "../components/ProductsItem";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.25 } },
};

const CATEGORIES     = ["Men", "Women", "Kids"];
const SUB_CATEGORIES = ["Topwear", "Bottomwear", "Winterwear"];
const SORT_OPTIONS   = [
  { value: "relevant", label: "Most Relevant" },
  { value: "low-high", label: "Price: Low → High" },
  { value: "high-low", label: "Price: High → Low" },
];

/* ── Inline icon set ── */
const Icons = {
  chevronDown: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  filter: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 10h10M11 16h2" />
    </svg>
  ),
  search: (
    <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  sort: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M9 17h6" />
    </svg>
  ),
  close: (
    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  check: (
    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  arrowRight: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
  grid: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  ),
  sparkle: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
    </svg>
  ),
};

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter]       = useState(false);
  const [filterProduct, setFilterProduct] = useState([]);
  const [category, setCategory]           = useState([]);
  const [subCategory, setSubCategory]     = useState([]);
  const [sortType, setSortType]           = useState("relevant");

  const toggle = (setter, value) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const applyFilter = () => {
    let copy = products.slice();
    if (showSearch && search)
      copy = copy.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category.length)
      copy = copy.filter((p) => category.includes(p.category));
    if (subCategory.length)
      copy = copy.filter((p) => subCategory.includes(p.subCategory));
    setFilterProduct(copy);
  };

  const sortProduct = () => {
    let copy = [...filterProduct];
    if (sortType === "low-high") copy.sort((a, b) => a.price - b.price);
    else if (sortType === "high-low") copy.sort((a, b) => b.price - a.price);
    else { applyFilter(); return; }
    setFilterProduct(copy);
  };

  useEffect(() => { applyFilter(); }, [category, subCategory, search, showSearch, products]);
  useEffect(() => { sortProduct();  }, [sortType]);

  const activeFilters = [...category, ...subCategory];

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 pt-10">

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        className="mb-8 border-b border-gray-100 pb-6"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 tracking-wide mb-3">
          <span className="hover:text-gray-600 cursor-pointer transition-colors">Home</span>
          <span className="text-gray-300">{Icons.chevronRight}</span>
          <span className="font-semibold text-gray-600">Collections</span>
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "2rem" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-[1.5px] bg-[#414141]"
              />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">
                Browse
              </span>
            </div>
            <div className="text-3xl sm:text-4xl">
              <Title text1={"All"} text2={"COLLECTIONS"} />
            </div>
          </div>

          {/* Live count badge */}
          <motion.div
            key={filterProduct.length}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-100 self-end mb-1"
          >
            <span className="text-[10px] text-gray-400 tracking-wide uppercase font-medium">Results</span>
            <span className="text-sm font-black text-[#1a1a1a] tabular-nums">{filterProduct.length}</span>
          </motion.div>
        </div>

        {/* Active filter trail */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-2 mt-3 flex-wrap"
            >
              <span className="text-[10px] text-gray-400 tracking-wide">Filtered by:</span>
              {activeFilters.map((f) => (
                <motion.span
                  key={f}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1a1a1a] text-white text-[10px] font-semibold tracking-wide"
                >
                  {f}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-8">

        {/* ── Sidebar Filter ── */}
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
          className="w-full sm:w-60 shrink-0"
        >
          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilter((v) => !v)}
            className="sm:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 mb-4 hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-700">
              <span className="text-gray-400">{Icons.filter}</span>
              Filters
              <AnimatePresence>
                {activeFilters.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="w-4 h-4 rounded-full bg-[#1a1a1a] text-white text-[9px] flex items-center justify-center font-black"
                  >
                    {activeFilters.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <motion.span
              className="text-gray-400"
              animate={{ rotate: showFilter ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {Icons.chevronDown}
            </motion.span>
          </button>

          {/* Desktop filter label */}
          <div className="hidden sm:flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">
              <span className="text-gray-400">{Icons.filter}</span>
              Filters
            </span>
            <AnimatePresence>
              {activeFilters.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  onClick={() => { setCategory([]); setSubCategory([]); }}
                  className="text-[10px] text-gray-400 hover:text-[#1a1a1a] tracking-wide uppercase font-semibold transition-colors flex items-center gap-1"
                >
                  Clear {Icons.close}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence initial={false}>
            {(showFilter || typeof window !== "undefined" && window.innerWidth >= 640) && (
              <motion.div
                key="filters"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="sm:!opacity-100 sm:!h-auto overflow-hidden"
              >

                {/* Active filter chips */}
                <AnimatePresence>
                  {activeFilters.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex flex-wrap gap-2 mb-5 pb-4 border-b border-gray-100"
                    >
                      {activeFilters.map((f) => (
                        <motion.button
                          key={f}
                          layout
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() =>
                            CATEGORIES.includes(f)
                              ? toggle(setCategory, f)
                              : toggle(setSubCategory, f)
                          }
                          className="flex items-center gap-1.5 px-3 py-1 bg-[#1a1a1a] text-white text-[10px] font-semibold tracking-wide uppercase rounded-full"
                        >
                          {f}
                          <span className="text-gray-400 opacity-70">{Icons.close}</span>
                        </motion.button>
                      ))}
                      <motion.button
                        layout
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => { setCategory([]); setSubCategory([]); }}
                        className="px-3 py-1 border border-gray-200 text-[10px] font-semibold tracking-wide uppercase rounded-full text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-colors"
                      >
                        Clear all
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <FilterGroup title="Category" icon={Icons.sparkle}>
                  {CATEGORIES.map((c) => (
                    <FilterChip
                      key={c}
                      label={c}
                      checked={category.includes(c)}
                      onChange={() => toggle(setCategory, c)}
                    />
                  ))}
                </FilterGroup>

                <FilterGroup title="Type" icon={Icons.grid}>
                  {SUB_CATEGORIES.map((s) => (
                    <FilterChip
                      key={s}
                      label={s}
                      checked={subCategory.includes(s)}
                      onChange={() => toggle(setSubCategory, s)}
                    />
                  ))}
                </FilterGroup>

              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>

        {/* ── Product Grid ── */}
        <div className="flex-1 min-w-0">

          {/* Sort bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100"
          >
            <p className="text-xs text-gray-400 tracking-wide hidden sm:flex items-center gap-1.5">
              <span className="text-gray-300">{Icons.grid}</span>
              Showing{" "}
              <motion.span
                key={filterProduct.length}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-semibold text-gray-700 tabular-nums"
              >
                {filterProduct.length}
              </motion.span>{" "}
              results
            </p>

            <div className="relative ml-auto flex items-center gap-2">
              <span className="hidden sm:block text-gray-300">{Icons.sort}</span>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:border-gray-400 cursor-pointer transition-colors hover:border-gray-300"
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                {Icons.chevronDown}
              </span>
            </div>
          </motion.div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {filterProduct.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5"
                >
                  {Icons.search}
                </motion.div>
                <p className="text-sm font-semibold text-gray-700 mb-1.5">No products found</p>
                <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">Try adjusting your filters or search term.</p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setCategory([]); setSubCategory([]); }}
                  className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#333] transition-colors"
                >
                  Clear Filters {Icons.close}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-8"
              >
                {filterProduct.map((item, i) => (
                  <motion.div
                    key={item._id}
                    variants={cardVariants}
                    layout
                    className="group relative"
                    whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.33, 1, 0.68, 1] } }}
                  >
                    {/* Hover top-accent line */}
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#1a1a1a] origin-left z-10 pointer-events-none"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                    />
                    {/* Zero-padded index */}
                    <span className="absolute -top-4 left-0 text-[9px] font-black tracking-widest text-gray-200 group-hover:text-gray-400 transition-colors duration-200 select-none tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <ProductsItem
                      name={item.name}
                      id={item._id}
                      price={item.price}
                      image={item.image}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer result count */}
          <AnimatePresence>
            {filterProduct.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4"
              >
                <p className="text-xs text-gray-400 tracking-wide">
                  Showing all{" "}
                  <span className="font-semibold text-gray-700">{filterProduct.length}</span>{" "}
                  item{filterProduct.length !== 1 ? "s" : ""}
                  {activeFilters.length > 0 && (
                    <span className="text-gray-400"> for {activeFilters.join(", ")}</span>
                  )}
                </p>
                <motion.button
                  whileHover={{ scale: 1.03, gap: "10px" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-500 hover:text-[#1a1a1a] transition-colors duration-200"
                >
                  Back to top
                  <svg className="w-3.5 h-3.5 rotate-[-90deg]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

/* ── FilterGroup ── */
function FilterGroup({ title, icon, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4 rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-gray-600">
          <span className="text-gray-400">{icon}</span>
          {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400"
        >
          {Icons.chevronDown}
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── FilterChip ── */
function FilterChip({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1">
      <motion.div
        onClick={onChange}
        whileTap={{ scale: 0.85 }}
        className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all duration-200 shrink-0 ${
          checked ? "bg-[#1a1a1a] border-[#1a1a1a]" : "border-gray-300 group-hover:border-gray-500"
        }`}
      >
        <AnimatePresence>
          {checked && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              {Icons.check}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <span className={`text-sm transition-colors duration-200 ${checked ? "text-[#1a1a1a] font-semibold" : "text-gray-500 group-hover:text-gray-800"}`}>
        {label}
      </span>
      {checked && (
        <motion.div
          layoutId={`dot-${label}`}
          className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1a1a1a]"
        />
      )}
    </label>
  );
}

export default Collection;