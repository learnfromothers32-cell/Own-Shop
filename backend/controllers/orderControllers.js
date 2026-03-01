import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// global variables
const currency = "inr";
const deliveryCharges = 100;

// Gateway Initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing orders using COD
const placeOrder = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    console.log("🔍 REQUEST BODY RECEIVED:", req.body);
    console.log("📦 Extracted fields:", { userId, items, amount, address });
    
    // Validate required fields
    if (!userId) {
      return res.json({ 
        success: false, 
        message: "User ID is required" 
      });
    }
    
    if (!items || items.length === 0) {
      return res.json({ 
        success: false, 
        message: "Cart items are required" 
      });
    }
    
    if (!amount) {
      return res.json({ 
        success: false, 
        message: "Amount is required" 
      });
    }
    
    if (!address) {
      return res.json({ 
        success: false, 
        message: "Address is required" 
      });
    }
    
    // Create the order in database first
    const newOrder = new orderModel({
      userId: userId,
      items: items,
      amount: amount,
      address: address,
      paymentMethod: 'Stripe',
      payment: false,
      date: Date.now()
    });
    
    await newOrder.save();
    console.log("✅ Order saved with ID:", newOrder._id);
    
    // Create line items for Stripe
    const line_items = items.map(item => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
          description: item.description || '',
          images: item.image && item.image.length > 0 ? [item.image[0]] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add delivery charges as a line item
    if (deliveryCharges > 0) {
      line_items.push({
        price_data: {
          currency: currency,
          product_data: {
            name: 'Delivery Charges',
            description: 'Shipping and handling',
          },
          unit_amount: deliveryCharges * 100,
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
      metadata: {
        orderId: newOrder._id.toString(),
        userId: userId.toString()
      },
      customer_email: address.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'GH', 'IN'],
      },
      phone_number_collection: {
        enabled: true,
      },
    });

    console.log("✅ Stripe session created:", session.id);
    console.log("✅ Stripe session URL:", session.url);
    
    res.json({ 
      success: true, 
      message: "Order placed successfully",
      orderId: newOrder._id,
      session_url: session.url
    });
    
  } catch (error) {
    console.log("❌ Error in placeOrderStripe:", error);
    res.json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Verify Stripe payment
const verifyStripe = async (req, res) => {
  try {
    const { orderId, success, userId } = req.body;
    
    console.log("🔍 Verifying Stripe payment:", { orderId, success, userId });
    
    if (!orderId) {
      return res.json({ success: false, message: "Order ID is required" });
    }
    
    if (success === "true") {
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId, 
        { payment: true },
        { new: true }
      );
      
      if (updatedOrder) {
        if (userId) {
          await userModel.findByIdAndUpdate(userId, { cartData: {} });
          console.log("✅ Cart cleared for user:", userId);
        }
        
        console.log("✅ Order payment verified:", updatedOrder._id);
        res.json({ 
          success: true, 
          message: "Payment verified successfully",
          order: updatedOrder 
        });
      } else {
        console.log("❌ Order not found:", orderId);
        res.json({ success: false, message: "Order not found" });
      }
    } else {
      const deletedOrder = await orderModel.findByIdAndDelete(orderId);
      if (deletedOrder) {
        console.log("❌ Payment failed - order deleted:", orderId);
        res.json({ success: false, message: "Payment failed - order cancelled" });
      } else {
        console.log("❌ Order not found for deletion:", orderId);
        res.json({ success: false, message: "Order not found" });
      }
    }
    
  } catch (error) {
    console.log("❌ Error in verifyStripe:", error);
    res.json({ success: false, message: error.message });
  }
};

// All Order data for Admin Panel - ADD THIS FUNCTION
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// user Order data for Frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID not found",
      });
    }

    const orders = await orderModel.find({ userId }).sort({ date: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// update order status from Admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Export all functions
export {
  placeOrder,
  placeOrderStripe,
  allOrders,      // ✅ Now this function exists!
  userOrders,
  updateStatus,
  verifyStripe
};