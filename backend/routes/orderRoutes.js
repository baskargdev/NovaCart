import express from "express";
import {
  placeOrder,
  getOrders,
  getOrderById,
  cancelOrder
} from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Place Order
router.post("/place", authMiddleware, placeOrder);
// Get all orders of the logged-in user
router.get("/", authMiddleware, getOrders);
// Get a single order by ID
router.get("/:id", authMiddleware, getOrderById);
// Cancel order
router.put("/:id/cancel", authMiddleware, cancelOrder);
export default router;
