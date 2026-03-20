import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import orderModel from "../models/orderModel.js"; // ✅ Add this import

const adminRouter = express.Router();

// All admin routes require admin authentication
adminRouter.get("/stats", adminAuth, getDashboardStats);

// ✅ Get single order details
adminRouter.get("/order/:orderId", adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("❌ Error fetching order details:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
});

// ✅ Update order status
adminRouter.post("/update-status", adminAuth, async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    if (!updatedOrder) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.log("❌ Error updating order status:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
});

export default adminRouter;
