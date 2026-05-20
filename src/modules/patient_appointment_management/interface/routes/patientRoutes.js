import express from "express";

import { uploadPatientImage } from "../../../../core/middleware/uploadPatientImage.js";
import {
  updatePatient,
  getPatientById,
  // searchPatients,
  getPatientOfDoctorInClinic,
  createPatient,
  // getInformationsOfPatient,
  uploadPatientImage as uploadPatientImageController,
} from "../controllers/PatientController.js";

import authMiddleware from "../../../../core/middleware/Auth.js";
import { requireUser } from "../../../../core/middleware/requireUser.js";

import requireActiveSubscription from "../../../../core/middleware/RequireActiveSubscription.js";

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

router.put(
  "/:patientId/patient",
  authMiddleware,
  requireActiveSubscription,
  requireUser,
  updatePatient,
);

router.patch(
  "/patients/:patientId/image",
  authMiddleware,
  requireUser,
  uploadPatientImage.single("patient_image"),
  uploadPatientImageController,
);

export default router;
