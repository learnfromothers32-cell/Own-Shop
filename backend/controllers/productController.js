// function for Add product
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import productModel from "../models/productModel.js";

// function for Add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    console.log("Product Data:", {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    });

    console.log("Images:", {
      image1: image1?.originalname || "No image",
      image2: image2?.originalname || "No image",
      image3: image3?.originalname || "No image",
      image4: image4?.originalname || "No image",
    });

    // Upload images to Cloudinary
    const images = [image1, image2, image3, image4].filter(
      (img) => img !== undefined,
    );
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        fs.unlinkSync(item.path);
        return result.secure_url;
      }),
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestSeller: bestSeller === "true" || bestSeller === true,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    console.log(productData);
    const product = new productModel(productData);
    await product.save();

    // ✅ SINGLE response with correct spelling
    res.json({
      success: true,
      message: "Product Added",
      imagesUrl, // optional: to see the uploaded URLs
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for list product
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for add Removing Product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };