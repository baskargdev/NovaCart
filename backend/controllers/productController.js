import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Generate unique SKU
const generateSKU = async (category) => {
  const categoryCode = category
    ? category.substring(0, 3).toUpperCase()
    : "GEN";

  let sku;
  let exists = true;

  while (exists) {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    sku = `NC-${categoryCode}-${randomCode}`;

    exists = await Product.exists({ sku });
  }

  return sku;
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      brand,
      category,
      stock,
      rating,
      reviews,
      featured,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "ecommerce-products",
    });

    fs.unlinkSync(req.file.path);

    // Generate SKU automatically
    const sku = await generateSKU(category);

    const product = await Product.create({
      name,
      description,
      price,
      oldPrice,
      brand,
      sku,
      image: result.secure_url,
      imagePublicId: result.public_id,
      category,
      stock,
      rating,
      reviews,
      featured,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const {
      search = "",
      category,
      featured,
      newArrivals,
      page = 1,
      limit = 12,
      sort = "-createdAt",
      minPrice,
      maxPrice,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.max(Number(limit) || 12, 1);
    const skip = (pageNumber - 1) * limitNumber;

    const query = {};

    // SEARCH
    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
        {
          sku: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // CATEGORY
    if (category) {
      query.category = category;
    }

    // FEATURED
    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    // PRICE RANGE
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // NEW ARRIVALS
    if (newArrivals === "true") {
      const fourteenDaysAgo = new Date();

      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      query.createdAt = {
        $gte: fourteenDaysAgo,
      };
    }

    // SORTING
    let sortQuery = {};

    switch (sort) {
      case "newest":
        sortQuery = {
          createdAt: -1,
          _id: -1,
        };
        break;

      case "-createdAt":
        sortQuery = {
          createdAt: -1,
          _id: -1,
        };
        break;

      case "oldest":
        sortQuery = {
          createdAt: 1,
          _id: 1,
        };
        break;

      case "priceLow":
        sortQuery = {
          price: 1,
          _id: 1,
        };
        break;

      case "priceHigh":
        sortQuery = {
          price: -1,
          _id: -1,
        };
        break;

      case "rating":
        sortQuery = {
          rating: -1,
          _id: -1,
        };
        break;

      default:
        sortQuery = {
          createdAt: -1,
          _id: -1,
        };
        break;
    }

    // TOTAL PRODUCTS
    const totalProducts = await Product.countDocuments(query);

    const totalPages = Math.ceil(totalProducts / limitNumber);

    // PRODUCTS
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNumber);

    return res.status(200).json({
      success: true,
      page: pageNumber,
      limit: limitNumber,
      totalProducts,
      totalPages,
      sort,
      products,
    });
  } catch (error) {
    console.error("Get All Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);
    console.log(req.params);

    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      description,
      price,
      oldPrice,
      brand,
      category,
      stock,
      rating,
      reviews,
      featured,
    } = req.body;

    // Upload new image if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "ecommerce-products",
      });

      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }

      fs.unlinkSync(req.file.path);

      product.image = result.secure_url;
      product.imagePublicId = result.public_id;
    }

    // Update product fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.oldPrice = oldPrice;
    product.brand = brand;
    product.category = category;
    product.stock = stock;
    product.rating = rating;
    product.reviews = reviews;
    product.featured = featured;

    // Existing SKU is intentionally preserved
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log("========== UPDATE PRODUCT ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
