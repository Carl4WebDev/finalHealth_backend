import express from "express";

import { loginLimiter } from "../../../core/middleware/rateLimiters.js";
import { validateAdminRegister } from "./validators/validateAdminRegister.js";
import authMiddleware from "../../../core/middleware/Auth.js";
// ADMIN CONTROLLERS
import {
  login as adminLogin,
  register as adminRegister,
} from "./controllers/adminController.js";

const router = express.Router();

/**
 * ===========================
 * ADMIN AUTH ROUTES
 * ===========================
 */
router.post("/register", validateAdminRegister, adminRegister);
router.post("/login", loginLimiter, adminLogin);

export default router;
