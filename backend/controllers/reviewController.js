import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const totalReviews = reviews.length;

  let averageRating = 0;

  if (totalReviews > 0) {
    const totalRating = reviews.reduce((sum, review) => {
      return sum + review.rating;
    }, 0);

    averageRating = totalRating / totalReviews;
  }

  await Product.findByIdAndUpdate(productId, {
    rating: averageRating.toFixed(1),
    reviews: totalReviews,
  });
};

// Add Review
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Check required fields
    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user purchased this product
    const deliveredOrder = await Order.findOne({
      user: req.user.id,
      orderStatus: "Delivered",
      "items.product": productId,
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        success: false,
        message:
          "You can review this product only after it has been delivered to you",
      });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Create review
    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating,
      comment,
    });

    // Update product rating & review count
    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Add Review Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
};

// Get Reviews of a Product
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      product: productId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalReviews: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// Update Review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Check required fields
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required",
      });
    }

    // Find review
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check ownership
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this review",
      });
    }

    // Update review
    review.rating = rating;
    review.comment = comment;

    await review.save();

    // Update product rating
    await updateProductRating(review.product);

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Update Review Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Find review
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check ownership
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review",
      });
    }

    // Store product id before deleting
    const productId = review.product;

    // Delete review
    await review.deleteOne();

    // Update product rating and review count
    await updateProductRating(productId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

export const getMyReview = async (req, res) => {
  try {
    const { productId } = req.params;

    const review = await Review.findOne({
      product: productId,
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      reviewed: !!review,
      review: review || null,
    });
  } catch (error) {
    console.error("Get My Review Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check review",
      error: error.message,
    });
  }
};