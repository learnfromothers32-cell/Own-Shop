import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/shopContext";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  const context = useContext(ShopContext);
  console.log("🔍 Full ShopContext:", context);
  console.log("🔍 Token:", context.token);
  console.log("🔍 UserId from context:", context.userId);
  
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    userId
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

    console.log("🔍 userId from localStorage:", localStorage.getItem('userId'));
  console.log("🔍 token from localStorage:", localStorage.getItem('token'));

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone'];
    const missing = requiredFields.find(field => !formData[field]);
    
    if (missing) {
      toast.error(`Please fill in ${missing.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    
    return true;
  };

  const processCartItems = () => {
    return Object.entries(cartItems).flatMap(([productId, sizes]) =>
      Object.entries(sizes)
        .filter(([_, quantity]) => quantity > 0)
        .map(([size, quantity]) => {
          const product = products.find(p => p._id === productId);
          if (!product) return null;
          return {
            ...JSON.parse(JSON.stringify(product)),
            size,
            quantity
          };
        })
        .filter(Boolean)
    );
  };

  const handleCodPayment = async (orderData) => {
    const response = await axios.post(
      `${backendUrl}/api/order/place`,
      orderData,
      { headers: { token } }
    );
    
    if (response.data.success) {
      setCartItems({});
      toast.success("Order placed successfully!");
      navigate("/orders");
    } else {
      throw new Error(response.data.message);
    }
  };

  const handleStripePayment = async (orderData) => {
    console.log("Sending to Stripe API:", orderData);
    
    const response = await axios.post(
      `${backendUrl}/api/order/stripe`,
      orderData,
      { headers: { token } }
    );
    
    if (response.data.success) {
      // Redirect to Stripe checkout
      const { session_url } = response.data;
      if (session_url) {
        window.location.replace(session_url);
      } else {
        throw new Error("No session URL received");
      }
    } else {
      throw new Error(response.data.message);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (isProcessing) return;
    
    if (!validateForm()) return;
    
    setIsProcessing(true);

    try {
      const orderItems = processCartItems();

      if (orderItems.length === 0) {
        toast.error("Your cart is empty");
        setIsProcessing(false);
        return;
      }

      // Check if userId exists
      if (!userId) {
        toast.error("User not authenticated. Please log in again.");
        setIsProcessing(false);
        navigate("/login");
        return;
      }

      // Include userId in orderData
      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        userId: userId
      };

      console.log("Sending order data:", orderData);

      if (method === "cod") {
        await handleCodPayment(orderData);
        setIsProcessing(false);
      } else if (method === "stripe") {
        await handleStripePayment(orderData);
        // Don't set isProcessing false here - page will redirect
      } else {
        throw new Error("Invalid payment method");
      }
    } catch (error) {
      setIsProcessing(false);
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* Left Side - Delivery Information */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input
            required
            value={formData.firstName}
            name="firstName"
            onChange={onChangeHandler}
            placeholder="First name"
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            disabled={isProcessing}
          />
          <input
            required
            value={formData.lastName}
            name="lastName"
            onChange={onChangeHandler}
            placeholder="Last name"
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            disabled={isProcessing}
          />
        </div>
        
        <input
          required
          value={formData.email}
          name="email"
          onChange={onChangeHandler}
          placeholder="Email address"
          type="email"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          disabled={isProcessing}
        />
        
        <input
          required
          value={formData.street}
          name="street"
          onChange={onChangeHandler}
          placeholder="Street"
          type="text"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          disabled={isProcessing}
        />

        <div className="flex gap-3">
          <input
            required
            value={formData.city}
            name="city"
            onChange={onChangeHandler}
            placeholder="City"
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            disabled={isProcessing}
          />
          <input
            required
            value={formData.state}
            name="state"
            onChange={onChangeHandler}
            placeholder="State"
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            disabled={isProcessing}
          />
        </div>

        <div className="flex gap-3">
          <input
            required
            value={formData.zipcode}
            name="zipcode"
            onChange={onChangeHandler}
            placeholder="Zip Code"
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            disabled={isProcessing}
          />
          <input
            required
            value={formData.country}
            name="country"
            onChange={onChangeHandler}
            placeholder="Country"
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            disabled={isProcessing}
          />
        </div>
        
        <input
          required
          value={formData.phone}
          name="phone"
          onChange={onChangeHandler}
          placeholder="Phone"
          type="tel"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          disabled={isProcessing}
        />
      </div>

      {/* Right Side - Payment */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          {/* Payment Method Selection */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => !isProcessing && setMethod("stripe")}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400" : ""}`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe" />
            </div>

            <div
              onClick={() => !isProcessing && setMethod("cod")}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              disabled={isProcessing}
              className={`bg-black text-white px-16 py-3 text-sm ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
            >
              {isProcessing ? "PROCESSING..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;