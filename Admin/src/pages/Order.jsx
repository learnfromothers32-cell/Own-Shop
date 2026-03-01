import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } },
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        setOrders(response.data.orders.reverse()); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status", // Added missing slash
        { orderId, status: event.target.value },
        { headers: { token } }, // Fixed headers format
      );

      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message); // Fixed undefined response
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Display orders

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h3 className="text-2xl font-semibold mb-6">Orders</h3>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <div key={index} className="bg-white border rounded-lg p-5">
            {/* Header - Order Info */}
            <div className="flex justify-between items-center pb-3 border-b mb-3">
              <div className="flex items-center gap-3">
                <img src={assets.parcel_icon} alt="" className="w-8 h-8" />
                <div>
                  <p className="font-medium">Order #{index + 1}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  Total:{" "}
                  <span className="font-bold">
                    {currency}
                    {order.amount}
                  </span>
                </p>
                <p
                  className={`text-xs ${order.payment ? "text-green-600" : "text-orange-500"}`}
                >
                  {order.payment ? "✓ Paid" : "⏳ Pending"}
                </p>
              </div>
            </div>

            {/* Customer Info - Compact */}
            <div className="bg-gray-50 p-2 rounded text-sm mb-4">
              <p className="font-medium">
                {order.address?.firstName} {order.address?.lastName}
              </p>
              <p className="text-xs text-gray-600">
                {order.address?.phone} • {order.address?.city},{" "}
                {order.address?.country}
              </p>
            </div>

            {/* ITEMS IN THE MIDDLE - with price and select */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Items:</p>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white border rounded p-2"
                  >
                    {/* Item name and details */}
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="w-20 text-right">
                      <p className="font-semibold">
                        {currency}
                        {item.price * item.quantity}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currency}
                        {item.price} each
                      </p>
                    </div>

                    {/* Select dropdown */}
                    <div className="w-32 ml-2">
                      <select
                        onChange={(event) => statusHandler(event, order._id)}
                        className="w-full text-xs border rounded px-2 py-1.5 bg-white"
                        defaultValue={order.status || "Order Placed"}
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">
                          Out for delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              Payment Method: {order.paymentMethod}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
