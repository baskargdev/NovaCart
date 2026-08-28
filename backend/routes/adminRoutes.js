import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

import {
  getAllOrders,
  updateOrderStatus,
} from "../controllers/adminController.js";

import { getAllUsers, deleteUser } from "../controllers/userController.js";

const router = express.Router();

// Orders
router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);

router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus,
);

// Users
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;
