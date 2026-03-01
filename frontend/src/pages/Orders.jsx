import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }
      
      setLoading(true);
      
      const response = await axios.post(
        backendUrl + "/api/order/userOrders",  // ✅ Updated to camelCase
        {},
        { headers: { token } },
      );

      if (response.data.success) {
        // Flatten the orders to get all items with their order info
        let allOrdersItems = [];
        response.data.orders.map((order) => {
          // Assuming order.items is the array of products
          order.items.map((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            allOrdersItems.push(item);
          });
        });
        setOrderData(allOrdersItems.reverse()); // Update state with flattened items
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error(error.response?.data?.message || "Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"My"} text2={"ORDERS"} />
      </div>

      <div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : orderData.length > 0 ? (
          orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  className="w-16 sm:w-20"
                  src={item.image?.[0] || item.image}
                  alt=""
                />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex item-center gap-3 mt-2 text-base text-gray-700">
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className="mt-2">
                    Date:{" "}
                    <span className="text-gray-400">
                      {item.date
                        ? new Date(item.date).toDateString()
                        : "25,jul,2026"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Payment: {item.paymentMethod} • {item.payment === true ? "Paid" : "Pending"}
                  </p>
                </div>
              </div>

              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p
                    className={`min-w-2 h-2 rounded-full ${item.status === "Delivered" ? "bg-green-500" : "bg-yellow-500"}`}
                  ></p>
                  <p className="text-sm md:text-base">
                    {item.status || "Ready to ship"}
                  </p>
                </div>
                <button 
                  onClick={loadOrderData} 
                  className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-100 transition"
                >
                  Track Order
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;