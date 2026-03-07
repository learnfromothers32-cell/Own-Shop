import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/shopContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl, userId } =
    useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);

  const verifyPayment = async () => {
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    console.log("🔍 Verifying payment with:", {
      success,
      orderId,
      userId,
      token: token ? "Exists" : "Missing",
    });

    try {
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      if (!userId) {
        toast.error("User ID not found. Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        backendUrl + "/api/order/verifyStripe",
        {
          success,
          orderId,
          userId: userId,
        },
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("✅ Verification response:", response.data);

      if (response.data.success) {
        setCartItems({});
        toast.success("Payment successful! Order confirmed.");
        navigate("/orders");
      } else {
        toast.error("Payment failed. Please try again.");
        navigate("/cart");
      }
    } catch (error) {
      console.log("❌ Verification error:", error);

      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        toast.error(error.response.data.message || "Server error");
      } else if (error.request) {
        toast.error("No response from server. Check your connection.");
      } else {
        toast.error(error.message);
      }

      navigate("/cart");
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    console.log(
      "🔄 Verify component mounted/updated with token:",
      token ? "Exists" : "Missing",
    );

    if (token) {
      verifyPayment();
    } else {
      const checkToken = setTimeout(() => {
        if (!token) {
          toast.error("Please login first");
          navigate("/login");
        }
      }, 2000);

      return () => clearTimeout(checkToken);
    }
  }, [token, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
        {verifying ? (
          <>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-black mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold mb-3">Verifying Payment...</h2>
            <p className="text-gray-600 mb-4">
              Please wait while we confirm your payment.
            </p>
            <div className="text-sm text-gray-500">
              <p>Order ID: {searchParams.get("orderId")?.slice(-8) || "..."}</p>
              <p>
                Status:{" "}
                {searchParams.get("success") === "true" ? "Success" : "Pending"}
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-3">Redirecting...</h2>
            <p className="text-gray-600">Taking you to your orders page.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;
