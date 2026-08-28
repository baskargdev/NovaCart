import express from "express";

import {
  createContactMessage,
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
} from "../controllers/contactController.js";

import {authMiddleware} from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Customer
router.post("/", createContactMessage);

// Admin
router.get("/", authMiddleware, adminMiddleware, getContactMessages);

router.put("/:id/read", authMiddleware, adminMiddleware, markMessageAsRead);

router.delete("/:id", authMiddleware, adminMiddleware, deleteContactMessage);

export default router;
