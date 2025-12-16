import express from "express";
import {
  registerClinic,
  approveClinic,
  rejectClinic,
  getClinicById,
  getPendingClinics,
  getAllClinics,
} from "../controllers/ClinicController.js";

import authMiddleware from "../../../../core/middleware/Auth.js";
import { requireAdmin } from "../../../../core/middleware/requireAdmin.js";

const router = express.Router();

// USER
router.post("/", authMiddleware, registerClinic);

// ADMIN
router.post("/clinic/:id/approve", authMiddleware, requireAdmin, approveClinic);
router.post("/clinic/:id/reject", authMiddleware, requireAdmin, rejectClinic);
router.get(
  "/clinics/pending/all",
  authMiddleware,
  requireAdmin,
  getPendingClinics
);

// READ
router.get("/all-clinics", authMiddleware, getAllClinics);
router.get("/clinics/:id", authMiddleware, getClinicById);

export default router;
