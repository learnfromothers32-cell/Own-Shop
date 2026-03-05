import React, { useEffect, useState, useMemo } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

/* ── Professional Icons ── */
const Icons = {
  trash: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>,
  search: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  refresh: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>,
  package: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.375c0 .621.504 1.125 1.125 1.125z" /></svg>,
};

/* ── Animation Variants ── */
const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchList = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/list`);
      if (data.success) setList(data.products);
      else toast.error(data.message);
    } catch (error) {
      toast.error("Failed to sync inventory");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id, name) => {
    if (!window.confirm(`Permanently remove "${name}"?`)) return;

    setRemovingId(id);
    try {
      const { data } = await axios.post(`${backendUrl}/api/product/remove`, { id }, { headers: { token } });
      if (data.success) {
        toast.success("Product removed");
        setList(prev => prev.filter(item => item._id !== id)); // Optimistic UI update
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => { fetchList(); }, []);

  // Filtered list logic
  const filteredList = useMemo(() => {
    return list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [list, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-12 font-sans selection:bg-black selection:text-white">
      
      {/* ── Header Section ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
            <div className="w-8 h-[1px] bg-gray-300" />
            Inventory Management
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Product <span className="text-gray-300">Catalog</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
              {Icons.search}
            </span>
            <input 
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={fetchList}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <motion.div animate={loading ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              {Icons.refresh}
            </motion.div>
          </motion.button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[80px_1fr_150px_100px_80px] gap-4 px-8 py-5 border-b border-gray-50 bg-gray-50/50">
          {["Preview", "Product Details", "Category", "Price", "Action"].map((h) => (
            <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {h}
            </span>
          ))}
        </div>

        <div className="divide-y divide-gray-50">
          <AnimatePresence mode="popLayout">
            {loading ? (
              // Skeleton Loader
              [...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-[80px_1fr_150px_100px_80px] items-center gap-4 px-8 py-6 animate-pulse">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="w-8 h-8 bg-gray-100 rounded-full justify-self-center" />
                </div>
              ))
            ) : filteredList.length > 0 ? (
              filteredList.map((item) => (
                <motion.div 
                  layout
                  key={item._id}
                  {...fadeInUp}
                  className="grid grid-cols-[80px_1fr_100px_60px] md:grid-cols-[80px_1fr_150px_100px_80px] items-center gap-4 px-6 md:px-8 py-5 hover:bg-gray-50/80 transition-colors group"
                >
                  {/* Image */}
                  <div className="relative w-14 h-14 rounded-2xl border border-gray-100 overflow-hidden bg-gray-50 shadow-inner">
                    <img src={item.image[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{item.name}</h3>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase tracking-tighter">ID: {item._id.slice(-6)}</p>
                  </div>

                  {/* Category */}
                  <div className="hidden md:block">
                    <span className="px-3 py-1 bg-white border border-gray-200 text-[10px] font-bold rounded-full text-gray-500 uppercase tracking-wider shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-sm font-black text-gray-900 tabular-nums">
                    {currency}{item.price.toLocaleString()}
                  </div>

                  {/* Actions */}
                  <div className="justify-self-center">
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#fee2e2", color: "#ef4444" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeProduct(item._id, item.name)}
                      disabled={removingId === item._id}
                      className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 border border-gray-100 transition-all disabled:opacity-30"
                    >
                      {removingId === item._id ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      ) : Icons.trash}
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div {...fadeInUp} className="py-24 text-center">
                <div className="inline-flex p-5 bg-gray-50 rounded-full mb-4 text-gray-200">{Icons.package}</div>
                <h3 className="text-gray-900 font-bold">No products found</h3>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search or add new stock.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="mt-8 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-gray-400">
        <div className="flex items-center gap-4">
          <span>Active SKU: {list.length}</span>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-gray-900">Search Results: {filteredList.length}</span>
        </div>
        <div className="hidden md:block">System Status: <span className="text-green-500">Operational</span></div>
      </footer>
    </div>
  );
};

export default List;