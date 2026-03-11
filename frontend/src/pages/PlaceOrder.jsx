import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/shopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import MTNPaymentModal from "../components/MTNPaymentModal";

/* ── Inline icons ── */
const Icons = {
  chevronRight: (
    <svg
      className="w-3 h-3 text-gray-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  truck: (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
      />
    </svg>
  ),
  creditCard: (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
      />
    </svg>
  ),
  user: (
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
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  ),
  mail: (
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
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  ),
  phone: (
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
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  ),
  mapPin: (
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
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
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
  lock: (
    <svg
      className="w-3 h-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  ),
};

/* ── Reusable field component ── */
const Field = ({ icon, children }) => (
  <div className="relative group">
    {icon && (
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-500 transition-colors pointer-events-none">
        {icon}
      </span>
    )}
    {React.cloneElement(children, {
      className: `w-full border border-gray-200 rounded-xl py-2.5 text-sm text-gray-700 placeholder:text-gray-400 bg-white focus:outline-none focus:border-gray-400 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${icon ? "pl-9 pr-3.5" : "px-3.5"}`,
    })}
  </div>
);

/* ── Section header (mirrors app-wide pattern) ── */
const SectionHeader = ({ eyebrow, title1, title2, icon }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-1">
      <div className="h-[1.5px] w-8 bg-[#414141] shrink-0" />
      <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">
        {icon} {eyebrow}
      </span>
    </div>
    <div className="text-2xl sm:text-3xl">
      <Title text1={title1} text2={title2} />
    </div>
  </div>
);

/* ── Variants ── */
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: d, ease: [0.33, 1, 0.68, 1] },
  }),
};

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMTNModal, setShowMTNModal] = useState(false);
  const [mtnReferenceId, setMtnReferenceId] = useState(null); // ← Add this state

  const context = useContext(ShopContext);

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    userId,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "street",
      "city",
      "state",
      "zipcode",
      "country",
      "phone",
    ];
    const missing = requiredFields.find((f) => !formData[f]);
    if (missing) {
      toast.error(
        `Please fill in ${missing.replace(/([A-Z])/g, " $1").toLowerCase()}`,
      );
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const processCartItems = () =>
    Object.entries(cartItems).flatMap(([productId, sizes]) =>
      Object.entries(sizes)
        .filter(([_, qty]) => qty > 0)
        .map(([size, quantity]) => {
          const product = products.find((p) => p._id === productId);
          if (!product) return null;
          return { ...JSON.parse(JSON.stringify(product)), size, quantity };
        })
        .filter(Boolean),
    );

  const handleCodPayment = async (orderData) => {
    const response = await axios.post(
      `${backendUrl}/api/order/place`,
      orderData,
      { headers: { token } },
    );
    if (response.data.success) {
      setCartItems({});
      toast.success("Order placed successfully!");
      navigate("/orders");
    } else throw new Error(response.data.message);
  };

  const handleStripePayment = async (orderData) => {
    console.log("Sending to Stripe API:", orderData);
    const response = await axios.post(
      `${backendUrl}/api/order/stripe`,
      orderData,
      { headers: { token } },
    );
    if (response.data.success) {
      const { session_url } = response.data;
      if (session_url) window.location.replace(session_url);
      else throw new Error("No session URL received");
    } else throw new Error(response.data.message);
  };

  // Updated MTN success handler
  const handleMTNSuccess = async (referenceId) => {
    setMtnReferenceId(referenceId);
    setIsProcessing(true);
    
    try {
      const orderItems = processCartItems();
      
      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        userId,
        paymentReference: referenceId, // Send the MTN reference to backend
      };

      console.log("📦 Creating MTN order with data:", orderData);

      const response = await axios.post(
        `${backendUrl}/api/order/mtn`, // This calls the new MTN endpoint
        orderData,
        { headers: { token } },
      );

      console.log("✅ MTN order response:", response.data);

      if (response.data.success) {
        setCartItems({});
        toast.success("Order placed successfully with MTN MoMo!");
        navigate("/orders");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("❌ MTN order creation error:", error);
      toast.error(error.response?.data?.message || "Order creation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (isProcessing) return;
    if (!validateForm()) return;

    if (method === "mtn") {
      setShowMTNModal(true);
      return;
    }

    setIsProcessing(true);
    try {
      const orderItems = processCartItems();
      if (orderItems.length === 0) {
        toast.error("Your cart is empty");
        setIsProcessing(false);
        return;
      }
      if (!userId) {
        toast.error("User not authenticated. Please log in again.");
        setIsProcessing(false);
        navigate("/login");
        return;
      }
      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        userId,
      };
      console.log("Sending order data:", orderData);
      if (method === "cod") {
        await handleCodPayment(orderData);
        setIsProcessing(false);
      } else if (method === "stripe") await handleStripePayment(orderData);
      else throw new Error("Invalid payment method");
    } catch (error) {
      setIsProcessing(false);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  const filledCount = Object.values(formData).filter(Boolean).length;
  const totalFields = Object.keys(formData).length;

  return (
    <form
      onSubmit={onSubmitHandler}
      className="max-w-screen-xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-20 min-h-[80vh]"
    >
      {/* Breadcrumb */}
      <motion.div
        variants={sectionVariants}
        custom={0}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-1.5 text-[10px] text-gray-400 tracking-wide mb-8"
      >
        <span className="hover:text-gray-600 cursor-pointer transition-colors">
          Home
        </span>
        {Icons.chevronRight}
        <span
          className="hover:text-gray-600 cursor-pointer transition-colors"
          onClick={() => navigate("/cart")}
        >
          Cart
        </span>
        {Icons.chevronRight}
        <span className="font-semibold text-gray-600">Place Order</span>
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-between gap-12">
        {/* Left — Delivery */}
        <motion.div
          variants={sectionVariants}
          custom={0.05}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4 w-full sm:max-w-[480px]"
        >
          <SectionHeader
            eyebrow="Step 1"
            title1="DELIVERY"
            title2="INFORMATION"
            icon={Icons.truck}
          />

          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-1">
            <div className="flex-1 h-[3px] bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#1a1a1a] rounded-full"
                animate={{ width: `${(filledCount / totalFields) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              />
            </div>
            <span className="text-[10px] font-semibold text-gray-400 tabular-nums shrink-0">
              {filledCount}/{totalFields}
            </span>
          </div>

          {/* Name row */}
          <div className="flex gap-3">
            <Field icon={Icons.user}>
              <input
                required
                value={formData.firstName}
                name="firstName"
                onChange={onChangeHandler}
                placeholder="First name"
                type="text"
                disabled={isProcessing}
              />
            </Field>
            <Field>
              <input
                required
                value={formData.lastName}
                name="lastName"
                onChange={onChangeHandler}
                placeholder="Last name"
                type="text"
                disabled={isProcessing}
              />
            </Field>
          </div>

          <Field icon={Icons.mail}>
            <input
              required
              value={formData.email}
              name="email"
              onChange={onChangeHandler}
              placeholder="Email address"
              type="email"
              disabled={isProcessing}
            />
          </Field>

          <Field icon={Icons.mapPin}>
            <input
              required
              value={formData.street}
              name="street"
              onChange={onChangeHandler}
              placeholder="Street address"
              type="text"
              disabled={isProcessing}
            />
          </Field>

          <div className="flex gap-3">
            <Field>
              <input
                required
                value={formData.city}
                name="city"
                onChange={onChangeHandler}
                placeholder="City"
                type="text"
                disabled={isProcessing}
              />
            </Field>
            <Field>
              <input
                required
                value={formData.state}
                name="state"
                onChange={onChangeHandler}
                placeholder="State"
                type="text"
                disabled={isProcessing}
              />
            </Field>
          </div>

          <div className="flex gap-3">
            <Field>
              <input
                required
                value={formData.zipcode}
                name="zipcode"
                onChange={onChangeHandler}
                placeholder="Zip code"
                type="text"
                disabled={isProcessing}
              />
            </Field>
            <Field>
              <input
                required
                value={formData.country}
                name="country"
                onChange={onChangeHandler}
                placeholder="Country"
                type="text"
                disabled={isProcessing}
              />
            </Field>
          </div>

          <Field icon={Icons.phone}>
            <input
              required
              value={formData.phone}
              name="phone"
              onChange={onChangeHandler}
              placeholder="Phone number"
              type="tel"
              disabled={isProcessing}
            />
          </Field>
        </motion.div>

        {/* Right — Summary + Payment */}
        <motion.div
          variants={sectionVariants}
          custom={0.12}
          initial="hidden"
          animate="visible"
          className="mt-4 sm:mt-0 flex-1 min-w-[280px] max-w-full sm:max-w-[420px]"
        >
          {/* Cart total */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1.5px] w-8 bg-[#414141] shrink-0" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">
                Order Summary
              </span>
            </div>
            <CartTotal />
          </div>

          {/* Payment method */}
          <div className="mb-8">
            <SectionHeader
              eyebrow="Step 2"
              title1="PAYMENT"
              title2="METHOD"
              icon={Icons.creditCard}
            />

            <div className="flex flex-col gap-3">
              {/* Stripe */}
              <motion.div
                whileHover={!isProcessing ? { scale: 1.01 } : {}}
                whileTap={!isProcessing ? { scale: 0.99 } : {}}
                onClick={() => !isProcessing && setMethod("stripe")}
                className={`relative flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  method === "stripe"
                    ? "border-[#1a1a1a] bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                    method === "stripe"
                      ? "border-[#1a1a1a] bg-[#1a1a1a]"
                      : "border-gray-300"
                  }`}
                >
                  <AnimatePresence>
                    {method === "stripe" && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 20,
                        }}
                        className="text-white"
                      >
                        {Icons.check}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <img className="h-5" src={assets.stripe_logo} alt="Stripe" />
                {method === "stripe" && (
                  <motion.div
                    layoutId="payment-accent"
                    className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#1a1a1a] rounded-t-xl"
                  />
                )}
              </motion.div>

              {/* COD */}
              <motion.div
                whileHover={!isProcessing ? { scale: 1.01 } : {}}
                whileTap={!isProcessing ? { scale: 0.99 } : {}}
                onClick={() => !isProcessing && setMethod("cod")}
                className={`relative flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  method === "cod"
                    ? "border-[#1a1a1a] bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                    method === "cod"
                      ? "border-[#1a1a1a] bg-[#1a1a1a]"
                      : "border-gray-300"
                  }`}
                >
                  <AnimatePresence>
                    {method === "cod" && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 20,
                        }}
                        className="text-white"
                      >
                        {Icons.check}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-600">
                  Cash on Delivery
                </span>
                <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 border border-green-100 text-[10px] font-semibold text-green-700 tracking-wide">
                  Free
                </span>
                {method === "cod" && (
                  <motion.div
                    layoutId="payment-accent"
                    className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#1a1a1a] rounded-t-xl"
                  />
                )}
              </motion.div>

              {/* MTN MoMo */}
              <motion.div
                whileHover={!isProcessing ? { scale: 1.01 } : {}}
                whileTap={!isProcessing ? { scale: 0.99 } : {}}
                onClick={() => !isProcessing && setMethod("mtn")}
                className={`relative flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  method === "mtn"
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                    method === "mtn"
                      ? "border-yellow-500 bg-yellow-500"
                      : "border-gray-300"
                  }`}
                >
                  <AnimatePresence>
                    {method === "mtn" && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 20,
                        }}
                        className="text-white"
                      >
                        {Icons.check}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      MTN Mobile Money
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Pay with your MoMo wallet
                    </p>
                  </div>
                </div>

                <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-50 border border-yellow-100 text-[10px] font-semibold text-yellow-700 tracking-wide">
                  Instant
                </span>

                {method === "mtn" && (
                  <motion.div
                    layoutId="payment-accent"
                    className="absolute top-0 left-0 right-0 h-[1.5px] bg-yellow-500 rounded-t-xl"
                  />
                )}
              </motion.div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-3">
            <motion.button
              type="submit"
              disabled={isProcessing}
              whileHover={
                !isProcessing ? { scale: 1.02, backgroundColor: "#333" } : {}
              }
              whileTap={!isProcessing ? { scale: 0.98 } : {}}
              className="group w-full flex items-center justify-center gap-3 bg-[#1a1a1a] text-white text-[11px] font-semibold tracking-[0.25em] uppercase py-4 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.span
                    key="processing"
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
                    Processing…
                  </motion.span>
                ) : (
                  <motion.span
                    key="place"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    Place Order
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {Icons.arrowRight}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <p className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 tracking-wide">
              {Icons.lock}
              Secure checkout · SSL encrypted · Free returns
            </p>
          </div>
        </motion.div>
      </div>

      {/* MTN Payment Modal */}
      <MTNPaymentModal
        isOpen={showMTNModal}
        onClose={() => setShowMTNModal(false)}
        orderDetails={{
          orderId: `ORD${Date.now()}`,
          amount: getCartAmount() + delivery_fee,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
        }}
        onPaymentSuccess={handleMTNSuccess}
      />
    </form>
  );
};

export default PlaceOrder;