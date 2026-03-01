import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  allOrders,
  updateStatus,
  userOrders,
  verifyStripe, 
} from "../controllers/orderControllers.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin Features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Payment Features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/verifyStripe", authUser, verifyStripe);  // ✅ Keep as verifyStripe (camelCase)

// User Features
orderRouter.post("/userOrders", authUser, userOrders);  // ✅ Change from "/userorders" to "/userOrders"

export default orderRouter;