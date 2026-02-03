import express from "express";

import { loginLimiter } from "../../../core/middleware/rateLimiters.js";
import { validateAdminRegister } from "./validators/validateAdminRegister.js";
import authMiddleware from "../../../core/middleware/Auth.js";
// ADMIN CONTROLLERS
import {
  login as adminLogin,
  register as adminRegister,
  getAllSubscribers,
} from "./controllers/adminController.js";

const router = express.Router();

import { requireAdmin } from "../../../core/middleware/requireAdmin.js";

/**
 * ===========================
 * ADMIN AUTH ROUTES
 * ===========================
 */
router.post("/register", validateAdminRegister, adminRegister);
router.post("/login", loginLimiter, adminLogin);

router.get("/subscribers", authMiddleware, requireAdmin, getAllSubscribers);

export default router;
