import express from "express";

const router = express.Router();

import {
  getPatientOfDoctorInClinic,
  getPatientInfo,
  getPatientMedicalRecords,
  getMedicalRecordsFullDetails,
  uploadMedicalRecordDocuments,
  createMedicalRecord,
  getAllDiagnoses,
  createDiagnosis,
  updateDiagnosis,
  deleteDiagnosis,
  getAllTreatments,
  createTreatment,
  updateTreatment,
  deleteTreatment,
} from "../controllers/MedController.js";

import { requireUser } from "../../../../core/middleware/requireUser.js";
import authMiddleware from "../../../../core/middleware/Auth.js";

router.get(
  "/doctor/:doctorId/clinic/:clinicId/patients",
  authMiddleware,
  requireUser,
  getPatientOfDoctorInClinic,
);

router.get(
  "/patient/:patientId/patient-info",
  authMiddleware,
  requireUser,
  getPatientInfo,
);

router.get(
  "/patient/:patientId/patient-med-rec",
  authMiddleware,
  requireUser,
  getPatientMedicalRecords,
);

router.get(
  "/record/:recordId/patient-med-rec-detail",
  authMiddleware,
  requireUser,
  getMedicalRecordsFullDetails,
);

router.post(
  "/:recordId/documents",
  authMiddleware,
  requireUser,
  uploadMedicalRecordDocuments,
);

router.post(
  "/patient/:patientId/medical-records",
  authMiddleware,
  requireUser,
  createMedicalRecord,
);

// diagnosis and treatment management
router.get("/diagnoses", authMiddleware, requireUser, getAllDiagnoses);
router.post("/diagnoses", authMiddleware, requireUser, createDiagnosis);
router.patch("/diagnoses/:id", authMiddleware, requireUser, updateDiagnosis);
router.delete("/diagnoses/:id", authMiddleware, requireUser, deleteDiagnosis);

router.get("/treatments", authMiddleware, requireUser, getAllTreatments);
router.post("/treatments", authMiddleware, requireUser, createTreatment);
router.patch("/treatments/:id", authMiddleware, requireUser, updateTreatment);
router.delete("/treatments/:id", authMiddleware, requireUser, deleteTreatment);

export default router;
