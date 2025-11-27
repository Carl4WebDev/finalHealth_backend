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
import { validateRegister } from "./validators/validateRegister.js";
import { validateAdminRegister } from "./validators/validateAdminRegister.js";
import { validateProfile } from "./validators/validateProfile.js";

import authMiddleware from "../../../core/middleware/Auth.js";
// ADMIN CONTROLLERS
import {
  login as adminLogin,
  register as adminRegister,
} from "./controllers/adminController.js";

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

router.post("/login", login);
router.put(
  "/:userId/profile",
  authMiddleware,
  validateProfile,
  updateUserProfile
);

router.get("/:userId/personal-info", authMiddleware, getUserPersonalInfo);

/**
 * ===========================
 * ADMIN AUTH ROUTES
 * ===========================
 */
router.post("/admin/register", validateAdminRegister, adminRegister);
router.post("/admin/login", adminLogin);

export default router;
