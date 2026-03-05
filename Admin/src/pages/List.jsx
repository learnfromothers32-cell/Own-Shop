import React, { useEffect, useState, useMemo } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

/* ── Professional Icons ── */
const Icons = {
  trash: <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>,
  search: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  refresh: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>,
  package: <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.375c0 .621.504 1.125 1.125 1.125z" /></svg>,
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
        setList(prev => prev.filter(item => item._id !== id));
      }
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const filteredList = useMemo(() => {
    return list.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [list, searchQuery]);

  return (
    <div className="min-h-screen bg-white md:bg-gray-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 font-sans">
        
        {/* ── Responsive Header ── */}
        <header className="flex flex-col space-y-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">
                <div className="w-6 h-[1px] bg-gray-300" />
                Live Inventory
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                Product <span className="text-gray-400">Catalog</span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:flex-none">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {Icons.search}
                </span>
                <input 
                  type="text"
                  placeholder="Search..."
                  className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={fetchList}
                className="p-2.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
              >
                <motion.div animate={loading ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  {Icons.refresh}
                </motion.div>
              </button>
            </div>
          </div>
        </header>

        {/* ── Table Container ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
          
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-[100px_1fr_150px_120px_100px] gap-4 px-8 py-5 bg-gray-50/50 border-b border-gray-100">
            {["Preview", "Details", "Category", "Price", "Action"].map((h) => (
              <span key={h} className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
                {h}
              </span>
            ))}
          </div>

          <div className="divide-y divide-gray-50">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <SkeletonRows />
              ) : filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <ProductRow 
                    key={item._id} 
                    item={item} 
                    removingId={removingId} 
                    removeProduct={removeProduct} 
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Modern Footer ── */}
        <footer className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 border-t border-gray-100 pt-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Total: {list.length}
            </span>
            <span className="text-gray-200">|</span>
            <span className="text-gray-900">Matches: {filteredList.length}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            System Secure
          </div>
        </footer>
      </div>
    </div>
  );
};

/* ── Sub-Components for Cleanliness ── */

const ProductRow = ({ item, removingId, removeProduct }) => (
  <motion.div 
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="group px-4 md:px-8 py-5 flex flex-col md:grid md:grid-cols-[100px_1fr_150px_120px_100px] md:items-center gap-4 hover:bg-gray-50/50 transition-all"
  >
    {/* Mobile/Desktop Layout Switch */}
    <div className="flex items-center gap-4 md:contents">
      {/* Image */}
      <div className="relative w-16 h-16 md:w-14 md:h-14 rounded-2xl border border-gray-100 overflow-hidden bg-gray-50 shrink-0">
        <img src={item.image[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="text-sm md:text-base font-bold text-gray-900 truncate">{item.name}</h3>
        <p className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {item._id.slice(-6).toUpperCase()}</p>
        
        {/* Mobile-only Price & Category */}
        <div className="flex items-center gap-2 mt-2 md:hidden">
          <span className="text-sm font-black text-gray-900">₵{item.price.toLocaleString()}</span>
          <span className="px-2 py-0.5 bg-gray-100 text-[9px] font-bold rounded-md text-gray-500 uppercase">
            {item.category}
          </span>
        </div>
      </div>
    </div>

    {/* Desktop Category */}
    <div className="hidden md:block">
      <span className="px-3 py-1 bg-white border border-gray-200 text-[10px] font-bold rounded-lg text-gray-500 uppercase tracking-wider">
        {item.category}
      </span>
    </div>

    {/* Desktop Price */}
    <div className="hidden md:block text-base font-black text-gray-900 tabular-nums">
      ₵{item.price.toLocaleString()}
    </div>

    {/* Actions */}
    <div className="flex md:justify-center border-t md:border-none mt-2 md:mt-0 pt-3 md:pt-0">
      <button
        onClick={() => removeProduct(item._id, item.name)}
        disabled={removingId === item._id}
        className="w-full md:w-10 md:h-10 flex items-center justify-center gap-2 md:gap-0 py-2 md:py-0 rounded-xl bg-red-50 md:bg-transparent text-red-500 md:text-gray-300 md:border md:border-gray-100 hover:md:bg-red-50 hover:md:text-red-500 hover:md:border-red-100 transition-all disabled:opacity-30"
      >
        {removingId === item._id ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {Icons.trash}
            <span className="md:hidden text-xs font-bold uppercase">Delete Product</span>
          </>
        )}
      </button>
    </div>
  </motion.div>
);

const SkeletonRows = () => (
  <>
    {[...Array(4)].map((_, i) => (
      <div key={i} className="px-8 py-6 flex flex-col md:grid md:grid-cols-[100px_1fr_150px_120px_100px] gap-4 animate-pulse">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-3 bg-gray-50 rounded w-1/4" />
        </div>
        <div className="hidden md:block h-6 bg-gray-50 rounded-lg w-20" />
        <div className="hidden md:block h-4 bg-gray-100 rounded w-16" />
        <div className="w-10 h-10 bg-gray-50 rounded-xl self-center" />
      </div>
    ))}
  </>
);

const EmptyState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
    <div className="inline-flex p-6 bg-gray-50 rounded-3xl mb-4 text-gray-200">
      {Icons.package}
    </div>
    <h3 className="text-gray-900 font-black text-lg">Inventory Empty</h3>
    <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">No products match your current search criteria. Try a different keyword.</p>
  </motion.div>
);

export default List;