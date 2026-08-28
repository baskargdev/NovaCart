import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  toggleWishlist,
  getWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

// Protect all wishlist routes
router.use(authMiddleware);

// Toggle Wishlist (Add / Remove)
router.post("/toggle", toggleWishlist);

// Get User Wishlist
router.get("/", getWishlist);

export default router;
