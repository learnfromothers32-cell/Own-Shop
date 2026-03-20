import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js"; // ✅ Add this import

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

// ✅ NEW: Save push notification token for logged-in users
userRouter.post("/push-token", authUser, async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.body.userId; // Comes from authUser middleware

    if (!token) {
      return res.json({
        success: false,
        message: "Push token is required",
      });
    }

    // Import the user model
    const userModel = (await import("../models/userModel.js")).default;

    // Update user with push token
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        pushToken: token,
        pushTokenUpdatedAt: Date.now(),
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    console.log(`✅ Push token saved for user ${userId}`);

    res.json({
      success: true,
      message: "Push notification token saved successfully",
    });
  } catch (error) {
    console.error("❌ Error saving push token:", error);
    res.json({
      success: false,
      message: error.message || "Failed to save push token",
    });
  }
});

// ✅ OPTIONAL: Remove push token (when user unsubscribes)
userRouter.post("/remove-push-token", authUser, async (req, res) => {
  try {
    const userId = req.body.userId;

    const userModel = (await import("../models/userModel.js")).default;

    await userModel.findByIdAndUpdate(userId, {
      $unset: { pushToken: 1, pushTokenUpdatedAt: 1 },
    });

    console.log(`✅ Push token removed for user ${userId}`);

    res.json({
      success: true,
      message: "Push token removed successfully",
    });
  } catch (error) {
    console.error("❌ Error removing push token:", error);
    res.json({
      success: false,
      message: error.message || "Failed to remove push token",
    });
  }
});

export default userRouter;
