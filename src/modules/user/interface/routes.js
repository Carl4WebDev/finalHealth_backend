import express from "express";
import multer from "multer";
// USER CONTROLLERS
import {
  register,
  login,
  updateUserProfile,
  getUserPersonalInfo,
  updateSettings,
  updateProfileImage,
} from "./controllers/userController.js";

import { loginLimiter } from "../../../core/middleware/rateLimiters.js";
import { validateRegister } from "./validators/validateRegister.js";
import { validateProfile } from "./validators/validateProfile.js";

import { requireUser } from "../../../core/middleware/requireUser.js";

import authMiddleware from "../../../core/middleware/Auth.js";

const router = express.Router();

/**
 * ===========================
 * USER AUTH ROUTES
 * ===========================
 */

const storage = multer.diskStorage({
  destination: "src/core/uploads/profile",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

router.patch("/update-settings", authMiddleware, requireUser, updateSettings);

router.patch(
  "/update-picture",
  authMiddleware,
  requireUser,
  upload.single("profileImg"),
  updateProfileImage,
);

router.post("/register", validateRegister, register);

router.post("/login", loginLimiter, login);

router.put(
  "/:userId/profile",
  authMiddleware,
  validateProfile,
  updateUserProfile,
);

router.get("/personal-info", authMiddleware, requireUser, getUserPersonalInfo);

export default router;
