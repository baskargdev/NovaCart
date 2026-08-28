import express from "express";
import upload from "../middleware/multer.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createProduct,
);

router.get("/", getAllProducts); //tThis API get all products and also search products by name using query parameter "search". 
                                //If no search value is provided, it will return all products.
router.get("/:id", getProductById);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateProduct,
);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);


export default router;