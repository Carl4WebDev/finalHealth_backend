import express from "express";
import {
  updatePatient,
  getPatientById,
  // searchPatients,
  getPatientOfDoctorInClinic,
  createPatient,
  // getInformationsOfPatient,
} from "../controllers/PatientController.js";

import authMiddleware from "../../../../core/middleware/Auth.js";
import { requireUser } from "../../../../core/middleware/requireUser.js";

const router = express.Router();

router.post("/", authMiddleware, requireUser, createPatient);

router.get(
  "/doctor/:doctorId/clinic/:clinicId/patients",
  authMiddleware,
  requireUser,
  getPatientOfDoctorInClinic,
);

// router.get(
//   "/doctor/:doctorId/clinic/:clinicId/patients",
//   authMiddleware,
//   requireUser,
//   getInformationsOfPatient
// );

router.get("/patient/:id", authMiddleware, getPatientById);

router.put("/:patientId/patient", authMiddleware, requireUser, updatePatient);

export default router;
