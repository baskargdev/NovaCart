import express from "express";

import {
  addReview,
  getReviewsByProduct,
  getMyReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add Review
router.post("/", authMiddleware, addReview);

// Get current user's review for a product
router.get("/my/:productId", authMiddleware, getMyReview);

// Get Reviews of a Product
router.get("/:productId", getReviewsByProduct);

// Update Review
router.put("/:id", authMiddleware, updateReview);

// Delete Review
router.delete("/:id", authMiddleware, deleteReview);

export default router;
