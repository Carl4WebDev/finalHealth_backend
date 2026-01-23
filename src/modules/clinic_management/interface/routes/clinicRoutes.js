import express from "express";
import {
  registerClinic,
  approveClinic,
  rejectClinic,
  getClinicById,
  getPendingClinics,
  getAllClinics,
  getAllClinicsOfDoctor,
  getAllClinicsOfUserNotAffiliated,
  createAffiliationDoctorToClinic,
  getClinicSessions,
  deleteClinicAffiliation,
  getClinicInfo,
  createClinicSession,
  updateClinicInfo,
  deleteClinicSession,
} from "../controllers/ClinicController.js";

import authMiddleware from "../../../../core/middleware/Auth.js";
import { requireAdmin } from "../../../../core/middleware/requireAdmin.js";
import { requireUser } from "../../../../core/middleware/requireUser.js";

const router = express.Router();

// USER
router.post("/", authMiddleware, requireUser, registerClinic);

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
// router.get("/clinics/:id", authMiddleware, getClinicById);

// ============================================================
// New & Planned api calls
// ============================================================
router.get(
  "/doctor/:doctorId/clinics",
  authMiddleware,
  requireUser,
  getAllClinicsOfDoctor
);

router.get(
  "/doctor/:doctorId/not-affiliated-clinics",
  authMiddleware,
  requireUser,
  getAllClinicsOfUserNotAffiliated
);

router.get(
  "/clinic/:clinicId/sessions",
  authMiddleware,
  requireUser,
  getClinicSessions
);

router.get(
  "/clinic/:clinicId/clinic-info",
  authMiddleware,
  requireUser,
  getClinicInfo
);

router.post(
  "/doctor/:doctorId/clinic/:clinicId/affiliate-clinic",
  authMiddleware,
  requireUser,
  createAffiliationDoctorToClinic
);

router.post(
  "/clinic/:clinicId/create-clinic-session",
  authMiddleware,
  requireUser,
  createClinicSession
);

router.delete(
  "/doctor/:doctorId/clinic/:clinicId/unaffiliate-clinic",
  authMiddleware,
  requireUser,
  deleteClinicAffiliation
);

router.delete(
  "/session/:sessionId/delete-session",
  authMiddleware,
  requireUser,
  deleteClinicSession
);

router.put(
  "/clinic/:clinicId/update-clinic",
  authMiddleware,
  requireUser,
  updateClinicInfo
);

export default router;
