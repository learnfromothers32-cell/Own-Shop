import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

// ─── Constants ───────────────────────────────────────────────────────────────
const STATUS_PIPELINE = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
];

const STATUS_META = {
  "Order Placed": {
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "📋",
    description: "Order has been received",
    dot: "bg-blue-600",
    ring: "ring-blue-100",
  },
  Packing: {
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    icon: "📦",
    description: "Items are being packed",
    dot: "bg-purple-600",
    ring: "ring-purple-100",
  },
  Shipped: {
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    icon: "🚚",
    description: "Order has been shipped",
    dot: "bg-sky-600",
    ring: "ring-sky-100",
  },
  "Out for delivery": {
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "🛵",
    description: "On the way to delivery",
    dot: "bg-amber-600",
    ring: "ring-amber-100",
  },
  Delivered: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: "✅",
    description: "Successfully delivered",
    dot: "bg-emerald-600",
    ring: "ring-emerald-100",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" })
    .format(amount)
    .replace("GHS", "₵");

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// ─── Custom Hook for Responsive Design ───────────────────────────────────────
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = (e) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

// ─── Sub-components ──────────────────────────────────────────────────────────
const SectionCard = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-gray-200 rounded-2xl p-6 md:p-7 lg:p-8 ${className}`}
  >
    {children}
  </div>
);

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-1.5">
    {children}
  </p>
);

const StatusPill = ({ status }) => {
  const meta = STATUS_META[status] || {
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
    dot: "bg-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full ${meta.bg} ${meta.border} border ${meta.color} font-semibold text-xs`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {status || "Pending"}
    </span>
  );
};

// ─── Desktop Status Timeline ─────────────────────────────────────────────────
const DesktopStatusTimeline = ({ currentStatus, onUpdate, updating }) => {
  const currentIdx = STATUS_PIPELINE.indexOf(currentStatus);

  return (
    <div className="flex flex-col gap-0">
      {STATUS_PIPELINE.map((step, idx) => {
        const isDone = idx < currentIdx;
        const isActive = idx === currentIdx;
        const isFuture = idx > currentIdx;
        const meta = STATUS_META[step];

        return (
          <div key={step} className="flex items-start gap-4">
            {/* Track */}
            <div className="flex flex-col items-center flex-shrink-0">
              <button
                onClick={() => !isActive && !updating && onUpdate(step)}
                disabled={isActive || updating}
                title={isActive ? "Current status" : `Set to ${step}`}
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-base
                  transition-all duration-200 relative z-10
                  ${isActive || isDone ? meta.bg : "bg-gray-50"}
                  ${
                    isActive
                      ? `border-2 ${meta.border} ring-4 ${meta.ring}`
                      : isDone
                        ? `border-2 ${meta.border}`
                        : "border-2 border-gray-200"
                  }
                  ${!isActive && !updating && isFuture ? "cursor-pointer hover:scale-105" : "cursor-default"}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                `}
              >
                {isDone ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className={meta.color}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="text-sm">{meta.icon}</span>
                )}
              </button>
              {idx < STATUS_PIPELINE.length - 1 && (
                <div
                  className={`w-0.5 h-9 -mt-1 -mb-1 transition-colors duration-300 ${
                    isDone ? meta.dot : "bg-gray-200"
                  }`}
                />
              )}
            </div>

            {/* Label */}
            <div
              className={`pt-1.5 ${idx < STATUS_PIPELINE.length - 1 ? "pb-8" : ""}`}
            >
              <p
                className={`
                  text-sm transition-colors duration-200
                  ${isActive ? "font-bold" : "font-medium"}
                  ${isFuture ? "text-gray-400" : "text-gray-900"}
                `}
              >
                {step}
              </p>
              {isActive && (
                <p className={`text-xs font-medium mt-0.5 ${meta.color}`}>
                  Current status
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Mobile Status Timeline (Fixed) ──────────────────────────────────────────
const MobileStatusTimeline = ({ currentStatus, onUpdate, updating }) => {
  const currentIdx = STATUS_PIPELINE.indexOf(currentStatus);

  const handleStepClick = (step, idx) => {
    if (updating) return;

    // Don't allow clicking on current or past steps
    if (idx <= currentIdx) {
      toast.info("Cannot update to current or previous status");
      return;
    }

    // Directly update without confirmation for faster interaction
    onUpdate(step);
  };

  return (
    <div className="space-y-3">
      {STATUS_PIPELINE.map((step, idx) => {
        const isDone = idx < currentIdx;
        const isActive = idx === currentIdx;
        const isFuture = idx > currentIdx;
        const meta = STATUS_META[step];

        return (
          <div
            key={step}
            onClick={() => handleStepClick(step, idx)}
            className={`
              relative flex items-start gap-3 p-2 -m-2 rounded-xl
              transition-all duration-200
              ${isFuture && !updating ? "cursor-pointer active:bg-gray-50" : "cursor-default"}
              ${updating && isFuture ? "opacity-50" : ""}
              focus:outline-none
            `}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {/* Connecting Line */}
            {idx < STATUS_PIPELINE.length - 1 && (
              <div
                className={`
                  absolute left-5 top-10 w-0.5 h-12
                  ${isDone ? meta.dot : "bg-gray-200"}
                `}
              />
            )}

            {/* Icon */}
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-lg
                flex-shrink-0 relative z-10
                ${
                  isDone
                    ? `${meta.bg} border-2 ${meta.border}`
                    : isActive
                      ? `bg-white border-2 ${meta.border} ring-4 ${meta.ring}`
                      : "bg-white border-2 border-gray-200"
                }
              `}
            >
              {isDone ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className={meta.color}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span>{meta.icon}</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p
                  className={`
                    font-semibold text-base
                    ${isDone ? meta.color : ""}
                    ${isActive ? meta.color : ""}
                    ${isFuture ? "text-gray-400" : "text-gray-900"}
                  `}
                >
                  {step}
                </p>
                {isActive && (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}
                  >
                    Current
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-0.5">{meta.description}</p>

              {isFuture && !updating && (
                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                  <span>Tap to update</span>
                  <span>→</span>
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Loading State */}
      {updating && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
          <span className="text-xs text-gray-600">Updating status...</span>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const OrderDetails = ({ token }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/order/${orderId}`,
        { headers: { token } },
      );
      if (data.success) {
        setOrder(data.order);
      } else {
        toast.error("Order not found");
        navigate("/orders");
      }
    } catch {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(`Status updated to ${newStatus}`);
        setOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-80 px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm font-medium">Loading order…</p>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!order) {
    return (
      <div className="text-center py-20 px-4">
        <p className="text-5xl mb-3">🔍</p>
        <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
        <button
          onClick={() => navigate("/orders")}
          className={`
            mt-4 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold
            hover:bg-gray-800 transition-colors min-h-[44px]
            ${isMobile ? "w-full" : "w-auto"}
          `}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const paymentLabel =
    order.paymentMethod === "MTN_MOMO"
      ? "📱 MTN Mobile Money"
      : order.paymentMethod === "Stripe"
        ? "💳 Stripe"
        : "💵 Cash on Delivery";

  const subtotal =
    order.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
  const deliveryFee = order.amount - subtotal;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12 bg-gray-50 min-h-screen w-full box-border"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-5 md:mb-7 flex-wrap">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-1.5 bg-none border-none cursor-pointer text-gray-500 text-sm font-medium py-2 md:py-0 min-h-[44px] hover:text-gray-900 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M19 12H5M12 5l-7 7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Orders
          </button>
          <span className="text-gray-300 text-sm">/</span>
          <span className="mono text-sm text-gray-700 font-medium break-all">
            #{order._id?.slice(-8).toUpperCase()}
          </span>
        </div>

        {/* Hero Row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className={isMobile ? "w-full" : ""}>
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h1
                className={`mono font-bold text-gray-900 tracking-tight m-0 break-word ${
                  isMobile ? "text-[clamp(20px,6vw,28px)]" : "text-3xl"
                }`}
              >
                #{order._id?.slice(-8).toUpperCase()}
              </h1>
              <StatusPill status={order.status} />
            </div>
            <p className="text-gray-400 text-sm m-0">
              Placed {formatDate(order.date)}
            </p>
          </div>
          <div
            className={
              isMobile
                ? "text-left w-full pt-2 border-t border-gray-200"
                : "text-right"
            }
          >
            <p className="text-[11px] text-gray-400 font-semibold tracking-wider uppercase mb-1">
              Order Total
            </p>
            <p
              className={`mono font-bold text-gray-900 tracking-tight m-0 ${
                isMobile ? "text-3xl" : "text-4xl"
              }`}
            >
              {formatCurrency(order.amount)}
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-5">
            {/* Customer + Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer */}
              <SectionCard>
                <SectionLabel>Customer</SectionLabel>
                <p className="font-bold text-base text-gray-900 mb-3.5 break-word">
                  {order.address?.firstName} {order.address?.lastName}
                </p>
                <div className="flex flex-col gap-2.5">
                  <InfoRow
                    icon="✉️"
                    label="Email"
                    value={order.address?.email}
                    mono
                  />
                  <InfoRow
                    icon="📞"
                    label="Phone"
                    value={order.address?.phone}
                    mono
                  />
                </div>
              </SectionCard>

              {/* Shipping */}
              <SectionCard>
                <SectionLabel>Ship to</SectionLabel>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-base text-gray-900 break-word">
                    {order.address?.street}
                  </p>
                  <p className="text-gray-500 text-sm break-word">
                    {order.address?.city}, {order.address?.state}{" "}
                    {order.address?.zipcode}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {order.address?.country}
                  </p>
                </div>
                <Divider />
                <InfoRow icon="💳" label="Payment" value={paymentLabel} />
                <div className="mt-2">
                  <PaymentBadge method={order.paymentMethod} />
                </div>
              </SectionCard>
            </div>

            {/* Order Items */}
            <SectionCard>
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                  <SectionLabel>Items</SectionLabel>
                  <p className="font-bold text-base text-gray-900 m-0">
                    Order Summary
                  </p>
                </div>
                <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">
                  {order.items?.length}{" "}
                  {order.items?.length === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Table Header - Hidden on mobile */}
              <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto] gap-4 pb-2.5 border-b border-gray-100 mb-1">
                {["", "Product", "Qty", "Total"].map((h) => (
                  <p
                    key={h}
                    className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase m-0"
                  >
                    {h}
                  </p>
                ))}
              </div>

              {/* Items */}
              {order.items?.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className={`
                    ${!isMobile ? "grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center" : "block"}
                    py-3.5 border-b border-gray-50 last:border-b-0
                  `}
                >
                  {!isMobile ? (
                    /* Desktop Layout */
                    <>
                      {/* Image */}
                      {item.image?.[0] ? (
                        <img
                          src={item.image[0]}
                          alt={item.name}
                          className="w-13 h-13 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-13 h-13 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                          📦
                        </div>
                      )}

                      {/* Name + Size */}
                      <div>
                        <p className="font-semibold text-gray-900 text-sm mb-0.5 break-word">
                          {item.name}
                        </p>
                        {item.size && (
                          <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {item.size}
                          </span>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatCurrency(item.price)} each
                        </p>
                      </div>

                      {/* Qty */}
                      <span className="mono text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200 text-center">
                        ×{item.quantity}
                      </span>

                      {/* Total */}
                      <span className="mono text-sm font-bold text-gray-900 text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </>
                  ) : (
                    /* Mobile Layout */
                    <div className="space-y-3">
                      <div className="flex gap-3 items-start">
                        {/* Image */}
                        {item.image?.[0] ? (
                          <img
                            src={item.image[0]}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                            📦
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1">
                          <p className="font-semibold text-base mb-1">
                            {item.name}
                          </p>
                          {item.size && (
                            <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {item.size}
                            </span>
                          )}
                          <p className="text-sm text-gray-700 mt-1.5">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                      </div>

                      {/* Quantity and Total */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-sm text-gray-500">Quantity:</span>
                        <span className="mono font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold">Total:</span>
                        <span className="mono font-bold text-gray-900 text-lg">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Totals Footer */}
              <div className="mt-5 pt-5 border-t-2 border-gray-100">
                <TotalRow label="Subtotal" value={formatCurrency(subtotal)} />
                {deliveryFee > 0 && (
                  <TotalRow
                    label="Delivery fee"
                    value={formatCurrency(deliveryFee)}
                  />
                )}
                <TotalRow
                  label="Total"
                  value={formatCurrency(order.amount)}
                  bold
                />
              </div>
            </SectionCard>
          </div>

          {/* Right Column - Status Panel */}
          <div className="flex flex-col gap-5">
            <SectionCard>
              <SectionLabel>Fulfillment</SectionLabel>
              <p className="font-bold text-base text-gray-900 mb-4 md:mb-6">
                Order Status
              </p>

              {isMobile ? (
                <MobileStatusTimeline
                  currentStatus={order.status || "Order Placed"}
                  onUpdate={handleStatusUpdate}
                  updating={updating}
                />
              ) : (
                <DesktopStatusTimeline
                  currentStatus={order.status || "Order Placed"}
                  onUpdate={handleStatusUpdate}
                  updating={updating}
                />
              )}

              {!isMobile && !updating && (
                <p className="text-[11px] text-gray-300 mt-5 leading-relaxed">
                  Click any step above to update the order to that status.
                </p>
              )}
            </SectionCard>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value, mono }) => (
  <div>
    <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mb-0.5">
      {label}
    </p>
    <p
      className={`${mono ? "mono" : ""} text-sm text-gray-700 font-medium break-word`}
    >
      {value}
    </p>
  </div>
);

const Divider = () => <div className="h-px bg-gray-100 my-3.5" />;

const TotalRow = ({ label, value, bold }) => (
  <div className="flex justify-between items-center py-1.5 flex-wrap gap-2">
    <span
      className={`text-sm ${bold ? "text-gray-900 font-bold" : "text-gray-500"}`}
    >
      {label}
    </span>
    <span
      className={`mono text-sm ${bold ? "font-bold text-gray-900" : "font-medium text-gray-700"} break-word`}
    >
      {value}
    </span>
  </div>
);

const PaymentBadge = ({ method }) => {
  const labels = {
    MTN_MOMO: {
      text: "MTN MoMo",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    Stripe: {
      text: "Stripe",
      color: "text-indigo-700",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
    },
    COD: {
      text: "Cash on Delivery",
      color: "text-gray-700",
      bg: "bg-gray-50",
      border: "border-gray-200",
    },
  };
  const m = labels[method] || labels.COD;
  return (
    <span
      className={`text-[11px] font-semibold ${m.color} ${m.bg} border ${m.border} rounded-md px-2.5 py-1 inline-block`}
    >
      {m.text}
    </span>
  );
};

export default OrderDetails;
