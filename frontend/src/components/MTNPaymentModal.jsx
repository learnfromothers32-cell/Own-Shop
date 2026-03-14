import React, { useState } from "react";
import { toast } from "react-toastify";

const MTNPaymentModal = ({
  isOpen,
  onClose,
  orderDetails,
  onPaymentSuccess,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    console.log("Pay button clicked!");

    if (!phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      console.log("Payment successful!");
      const referenceId = "MTN" + Date.now();
      onPaymentSuccess(referenceId);
      toast.success("Payment successful!");
      setLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">MTN Mobile Money</h2>

        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <p className="text-gray-600">Amount to pay</p>
          <p className="text-3xl font-bold text-yellow-600">
            GHS {orderDetails.amount}
          </p>
        </div>

        {/* Changed from <form> to <div> */}
        <div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="024XXXXXXX"
            required
            className="w-full p-3 border rounded-lg mb-4"
          />

          <button
            onClick={handlePay} // Changed from type="submit" to onClick
            disabled={loading}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default MTNPaymentModal;
