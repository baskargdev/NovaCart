import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// Toggle Wishlist
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if already exists
    const existingWishlist = await Wishlist.findOne({
      user: req.user.id,
      product: productId,
    });

    // Remove if already exists
    if (existingWishlist) {
      await Wishlist.findByIdAndDelete(existingWishlist._id);

      return res.status(200).json({
        success: true,
        wishlisted: false,
        message: "Removed from wishlist",
      });
    }

    // Add to wishlist
    await Wishlist.create({
      user: req.user.id,
      product: productId,
    });

    return res.status(201).json({
      success: true,
      wishlisted: true,
      message: "Added to wishlist",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update wishlist",
      error: error.message,
    });
  }
};

// Get User Wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user.id,
    }).populate("product");

    // Remove stale wishlist records whose products no longer exist
    const validWishlist = wishlist.filter((item) => item.product);

    // Clean up stale records from the database
    const staleWishlistIds = wishlist
      .filter((item) => !item.product)
      .map((item) => item._id);

    if (staleWishlistIds.length > 0) {
      await Wishlist.deleteMany({
        _id: { $in: staleWishlistIds },
        user: req.user.id,
      });
    }

    res.status(200).json({
      success: true,
      wishlist: validWishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
      error: error.message,
    });
  }
};