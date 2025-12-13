import express from "express";
import multer from "multer";
// USER CONTROLLERS
import {
  register,
  login,
  updateUserProfile,
  getUserPersonalInfo,
  updateSettings,
} from "./controllers/userController.js";

import { loginLimiter } from "../../../core/middleware/rateLimiters.js";
import { validateRegister } from "./validators/validateRegister.js";
import { validateProfile } from "./validators/validateProfile.js";

import authMiddleware from "../../../core/middleware/Auth.js";

const router = express.Router();

/**
 * ===========================
 * USER AUTH ROUTES
 * ===========================
 */

const storage = multer.diskStorage({
  destination: "uploads/profile/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

router.patch(
  "/update-settings",
  authMiddleware,
  upload.single("profileImg"),
  updateSettings
);

router.post("/register", validateRegister, register);

router.post("/login", loginLimiter, login);

router.put(
  "/:userId/profile",
  authMiddleware,
  validateProfile,
  updateUserProfile
);

router.get("/:userId/personal-info", authMiddleware, getUserPersonalInfo);
export default router;
