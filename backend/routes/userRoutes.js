import express from "express";

import {
  userInfo,
  loginAuth,
  updateProfile,
  getProfile,
  changePassword,
} from "../controllers/userController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", userInfo);

router.post("/login", loginAuth);

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

router.put("/change-password", authMiddleware, changePassword);

export default router;
