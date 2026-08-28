import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addToCart,
  getCart,
  updateCart,
  deleteCart
} from "../controllers/cartController.js";

const router = express.Router();

//Add to cart
router.post("/", authMiddleware, addToCart);

//Get user's cart
router.get("/", authMiddleware, getCart);

//update cart item quantity
router.put("/:id", authMiddleware, updateCart);

//delete cart itemdeleteCart
router.delete("/:id", authMiddleware, deleteCart); 



export default router;