import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// global variables
const currency = "GHC";
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

    // Create the order in database first
    const newOrder = new orderModel({
      userId: userId,
      items: items,
      amount: amount,
      address: address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    });

    await newOrder.save();

    // Create line items for Stripe
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add delivery charges
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharges * 100,
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
      metadata: {
        orderId: newOrder._id.toString(),
        userId: userId.toString(),
      },
    });

    res.json({
      success: true,
      session_url: session.url,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log("❌ Error in placeOrderStripe:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ MTN MoMo Order Placement
const placeOrderMTN = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { items, amount, address, paymentReference } = req.body;

    console.log("📱 MTN Order Request:", { userId, amount, paymentReference });

    // Validate required fields
    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "Cart items are required" });
    }

    if (!amount) {
      return res.json({ success: false, message: "Amount is required" });
    }

    if (!address) {
      return res.json({ success: false, message: "Address is required" });
    }

    // Create the order in database
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "MTN_MOMO",
      payment: true, // MTN payments are confirmed instantly
      paymentReference: paymentReference || `MTN${Date.now()}`,
      date: Date.now(),
      status: "Order Placed",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    console.log("✅ MTN Order saved with ID:", newOrder._id);

    res.json({
      success: true,
      message: "Order placed successfully with MTN MoMo",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log("❌ Error in placeOrderMTN:", error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe payment
const verifyStripe = async (req, res) => {
  try {
    const { orderId, success, userId } = req.body;

    if (success === "true") {
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true },
        { new: true },
      );

      if (updatedOrder) {
        if (userId) {
          await userModel.findByIdAndUpdate(userId, { cartData: {} });
        }
        res.json({ success: true, message: "Payment verified successfully" });
      } else {
        res.json({ success: false, message: "Order not found" });
      }
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed - order cancelled" });
    }
  } catch (error) {
    console.log("❌ Error in verifyStripe:", error);
    res.json({ success: false, message: error.message });
  }
};

// All Order data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order data for Frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.body.userId;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderMTN, 
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
};
