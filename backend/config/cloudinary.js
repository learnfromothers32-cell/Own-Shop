import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "Exists" : "Missing",
    api_secret: process.env.CLOUDINARY_SECRET_KEY ? "Exists" : "Missing"
  });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
  });

  // Test the connection
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary Connected Successfully");
  } catch (error) {
    console.error("Cloudinary Connection Failed:", error.message);
  }
};

export default connectCloudinary;