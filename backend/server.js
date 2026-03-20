import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http"; // ✅ Add this
import { Server } from "socket.io"; // ✅ Add this
import connectDb from "./config/mongoDb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import newsletterRouter from "./routes/newsletterRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// ✅ Create HTTP server for Socket.io
const server = http.createServer(app);

// ✅ Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://my-shop-1.vercel.app", 
      "https://own-shop-admin-1.vercel.app",
      "https://own-shop-1.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

connectDb();
connectCloudinary();

// ✅ Store online admins
const onlineAdmins = new Map();

// ✅ Socket.io connection handler
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  // Register user type (admin or regular)
  socket.on("register", (userData) => {
    console.log("📝 Registering user:", userData);
    if (userData?.isAdmin && userData?.userId) {
      onlineAdmins.set(userData.userId, socket.id);
      console.log(
        `✅ Admin registered: ${userData.userId} (Total admins: ${onlineAdmins.size})`,
      );

      // Send confirmation back
      socket.emit("registered", { success: true, role: "admin" });
    } else {
      console.log("👤 Regular user connected");
      socket.emit("registered", { success: true, role: "user" });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);

    // Remove from online admins
    for (const [userId, socketId] of onlineAdmins.entries()) {
      if (socketId === socket.id) {
        onlineAdmins.delete(userId);
        console.log(
          `❌ Admin removed: ${userId} (Remaining: ${onlineAdmins.size})`,
        );
        break;
      }
    }
  });
});

// ✅ Function to send notification to all admins
export const notifyAdmins = (notification) => {
  console.log(
    `📢 Sending notification to ${onlineAdmins.size} admins:`,
    notification,
  );

  onlineAdmins.forEach((socketId, userId) => {
    io.to(socketId).emit("new_order", {
      ...notification,
      timestamp: new Date().toISOString(),
    });
    console.log(`✅ Notification sent to admin ${userId}`);
  });

  // If no admins online, log it
  if (onlineAdmins.size === 0) {
    console.log("⚠️ No admins online to receive notification");
  }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);

// Health check endpoint (useful for monitoring)
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    adminsOnline: onlineAdmins.size,
  });
});

app.get("/", (req, res) => {
  res.send("API Working....");
});

// ✅ Replace app.listen with server.listen
server.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
  console.log(`🔔 Real-time notifications enabled with Socket.io`);
  console.log(`📊 Monitoring ${onlineAdmins.size} admins`);
});

// ✅ Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing connections...");
  io.close(() => {
    console.log("Socket.io closed");
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });
});
