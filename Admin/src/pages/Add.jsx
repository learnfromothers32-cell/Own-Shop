import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

/* ── Inline icons ── */
const Icons = {
  upload: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  ),
  check: (
    <svg
      className="w-3 h-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  ),
  tag: (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6h.008v.008H6V6z"
      />
    </svg>
  ),
  text: (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
      />
    </svg>
  ),
  currency: (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  grid: (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  ),
  star: (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.499z"
      />
    </svg>
  ),
  arrowRight: (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  ),
  close: (
    <svg
      className="w-3 h-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  device: (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
      />
    </svg>
  ),
};

/* ── Section header ── */
const SectionHeader = ({ eyebrow, icon }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="h-[1.5px] w-8 bg-[#414141] shrink-0" />
    <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">
      {icon} {eyebrow}
    </span>
  </div>
);

/* ── Field wrapper ── */
const Field = ({ label, icon, children }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
      {label}
    </span>
    <div className="relative group">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-500 transition-colors pointer-events-none">
          {icon}
        </span>
      )}
      {React.cloneElement(children, {
        className: `w-full border border-gray-200 rounded-xl py-2.5 text-sm text-gray-700 placeholder:text-gray-300 bg-white focus:outline-none focus:border-gray-400 transition-colors duration-200 ${icon ? "pl-9 pr-3.5" : "px-3.5"}`,
      })}
    </div>
  </div>
);

/* ── Variants ── */
const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: d, ease: [0.33, 1, 0.68, 1] },
  }),
};

const ACCESSORY_CATEGORIES = [
  "Cases",
  "Screen Protectors",
  "Chargers",
  "Cables",
  "Mounts",
  "Power Banks",
  "Headphones",
  "Smart Watches",
];
const DEVICE_COMPATIBILITY = [
  "iPhone",
  "Samsung",
  "Google Pixel",
  "AirPods",
  "iPad",
  "MacBook",
  "Apple Watch",
  "Universal",
];

function Add({ token }) {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Cases");
  const [bestSeller, setBestSeller] = useState(false);
  const [subCategory, setSubCategory] = useState("iPhone");
  const [sizes, setSizes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const images = [
    { state: image1, setter: setImage1, id: "image1" },
    { state: image2, setter: setImage2, id: "image2" },
    { state: image3, setter: setImage3, id: "image3" },
    { state: image4, setter: setImage4, id: "image4" },
  ];

  const toggleSize = (device) =>
    setSizes((prev) =>
      prev.includes(device)
        ? prev.filter((s) => s !== device)
        : [...prev, device],
    );

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller);
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Cases");
        setSubCategory("iPhone");
        setBestSeller(false);
        setSizes([]);
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full gap-8 max-w-2xl py-8 px-1"
    >
      {/* ── Page header ── */}
      <motion.div
        variants={sectionVariants}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3 mb-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "2rem" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[1.5px] bg-[#414141] shrink-0"
          />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">
            Inventory
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] tracking-tight">
          Add <span className="text-gray-400 font-medium">Phone Accessory</span>
        </h1>
      </motion.div>

      {/* ── Image upload ── */}
      <motion.div
        variants={sectionVariants}
        custom={0.05}
        initial="hidden"
        animate="visible"
        className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50"
      >
        <SectionHeader eyebrow="Product Images" icon={Icons.upload} />
        <div className="flex gap-3 flex-wrap">
          {images.map(({ state, setter, id }, i) => (
            <motion.label
              key={id}
              htmlFor={id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative cursor-pointer group"
            >
              <div
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex items-center justify-center
                ${state ? "border-[#1a1a1a]" : "border-dashed border-gray-200 hover:border-gray-400 bg-white"}`}
              >
                {state ? (
                  <img
                    src={URL.createObjectURL(state)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-300 group-hover:text-gray-400 transition-colors">
                    {Icons.upload}
                    <span className="text-[9px] font-semibold tracking-wide uppercase">
                      {i + 1}
                    </span>
                  </div>
                )}
              </div>

              {/* Uploaded indicator */}
              <AnimatePresence>
                {state && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white"
                  >
                    {Icons.check}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remove button */}
              <AnimatePresence>
                {state && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => {
                      e.preventDefault();
                      setter(false);
                    }}
                    className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {Icons.close}
                  </motion.button>
                )}
              </AnimatePresence>

              <input
                onChange={(e) => setter(e.target.files[0])}
                type="file"
                id={id}
                hidden
              />
            </motion.label>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-gray-400 tracking-wide">
          {images.filter(({ state }) => state).length} of 4 images uploaded
        </p>
      </motion.div>

      {/* ── Product details ── */}
      <motion.div
        variants={sectionVariants}
        custom={0.1}
        initial="hidden"
        animate="visible"
        className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col gap-4"
      >
        <SectionHeader eyebrow="Product Details" icon={Icons.tag} />

        <Field label="Product Name" icon={Icons.text}>
          <input
            type="text"
            placeholder="e.g. Premium Silicone Case for iPhone 15"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
            Description
          </span>
          <textarea
            rows={3}
            placeholder="Describe the accessory — materials, compatibility, features, charging speed…"
            required
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm text-gray-700 placeholder:text-gray-300 bg-white focus:outline-none focus:border-gray-400 transition-colors duration-200 resize-none"
          />
        </div>
      </motion.div>

      {/* ── Category + price ── */}
      <motion.div
        variants={sectionVariants}
        custom={0.15}
        initial="hidden"
        animate="visible"
        className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col gap-4"
      >
        <SectionHeader eyebrow="Category & Pricing" icon={Icons.grid} />

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Category - Accessory Type */}
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
              Accessory Type
            </span>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-400 transition-colors duration-200 appearance-none cursor-pointer"
            >
              {ACCESSORY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sub category - Compatibility */}
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
              Compatibility
            </span>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
              className="w-full border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-400 transition-colors duration-200 appearance-none cursor-pointer"
            >
              {DEVICE_COMPATIBILITY.map((device) => (
                <option key={device} value={device}>
                  {device}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <Field label="Price ($)" icon={Icons.currency}>
            <input
              type="number"
              placeholder="0.00"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              style={{ maxWidth: 130 }}
            />
          </Field>
        </div>
      </motion.div>

      {/* ── Compatible Devices (formerly Sizes) ── */}
      <motion.div
        variants={sectionVariants}
        custom={0.2}
        initial="hidden"
        animate="visible"
        className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50"
      >
        <SectionHeader eyebrow="Compatible Devices" icon={Icons.device} />
        <div className="flex gap-2 flex-wrap">
          {DEVICE_COMPATIBILITY.map((device) => {
            const active = sizes.includes(device);
            return (
              <motion.button
                key={device}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSize(device)}
                className={`relative px-4 py-2 rounded-xl border text-xs font-bold tracking-wide transition-all duration-200
                  ${
                    active
                      ? "bg-[#1a1a1a] border-[#1a1a1a] text-white"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
                  }`}
              >
                {active && (
                  <motion.div
                    layoutId={`device-accent-${device}`}
                    className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/30 rounded-t-xl"
                  />
                )}
                {device}
                <AnimatePresence>
                  {active && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#1a1a1a] border-2 border-white flex items-center justify-center"
                    >
                      {Icons.check}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {sizes.length > 0 && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-3 text-[10px] text-gray-400 tracking-wide"
            >
              Compatible with:{" "}
              <span className="font-semibold text-gray-600">
                {sizes.join(", ")}
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Bestseller toggle ── */}
      <motion.div
        variants={sectionVariants}
        custom={0.25}
        initial="hidden"
        animate="visible"
        className="px-5 py-4 border border-gray-100 rounded-2xl bg-gray-50/50"
      >
        <SectionHeader eyebrow="Visibility" icon={Icons.star} />
        <motion.label
          whileHover={{ x: 2 }}
          className="flex items-center gap-4 cursor-pointer group w-fit"
        >
          {/* Custom toggle */}
          <div
            onClick={() => setBestSeller((prev) => !prev)}
            className={`relative w-10 h-5 rounded-full border-2 transition-all duration-300 shrink-0
              ${bestSeller ? "bg-[#1a1a1a] border-[#1a1a1a]" : "bg-white border-gray-300 group-hover:border-gray-400"}`}
          >
            <motion.div
              animate={{ x: bestSeller ? 18 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-colors duration-200
                ${bestSeller ? "bg-white" : "bg-gray-300"}`}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              Add to Bestsellers
            </p>
            <p className="text-[10px] text-gray-400 tracking-wide">
              Featured on the homepage bestseller section
            </p>
          </div>
        </motion.label>
      </motion.div>

      {/* ── Submit ── */}
      <motion.div
        variants={sectionVariants}
        custom={0.3}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={
            !isSubmitting ? { scale: 1.02, backgroundColor: "#333" } : {}
          }
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          className="group w-full flex items-center justify-center gap-3 bg-[#1a1a1a] text-white text-[11px] font-semibold tracking-[0.25em] uppercase py-4 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.span
                key="submitting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                />
                Publishing…
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                Publish Accessory
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  {Icons.arrowRight}
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <p className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 tracking-wide">
          Accessory will be listed in the store immediately after publishing.
        </p>
      </motion.div>
    </form>
  );
}

export default Add;
