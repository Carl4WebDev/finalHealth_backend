import express from "express";

// USER CONTROLLERS
import { register, login } from "./controllers/userController.js";
import { validateRegister } from "./validators/validateRegister.js";
import { validateAdminRegister } from "./validators/validateAdminRegister.js";

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
router.post("/register", validateRegister, register);
router.post("/login", login);

/**
 * ===========================
 * ADMIN AUTH ROUTES
 * ===========================
 */
router.post("/admin/register", validateAdminRegister, adminRegister);
router.post("/admin/login", adminLogin);

export default router;
