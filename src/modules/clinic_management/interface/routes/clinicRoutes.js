import express from "express";
import {
  registerClinic,
  approveClinic,
  rejectClinic,
  getClinicById,
  getPendingClinics,
  getAllClinics,
  getUnassignedClinics,
} from "../controllers/ClinicController.js";

const router = express.Router();

import authMiddleware from "../../../../core/middleware/Auth.js";

router.get("/all-clinics", authMiddleware, getAllClinics);

router.get("/unassigned/:doctorId", authMiddleware, getUnassignedClinics);
//working
router.post("/", authMiddleware, registerClinic);
//working
router.post("/:id/approve", approveClinic);
//working
router.post("/:id/reject", rejectClinic);
//working
router.get("/clinics/:id", getClinicById);
//working
router.get("/clinics/pending/all", getPendingClinics);

export default router;
