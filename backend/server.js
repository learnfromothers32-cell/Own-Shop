
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/mongoDb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import newsletterRouter from "./routes/newsletterRoutes.js"; // Add this
import contactRouter from "./routes/contactRoutes.js"; // Add this

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDb();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/newsletter", newsletterRouter); // Add this
app.use("/api/contact", contactRouter); // Add this

app.get("/", (req, res) => {
  res.send("API Working....");
});

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});