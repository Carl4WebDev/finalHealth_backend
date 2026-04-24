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

  // VITAL SIGNS
  getAllVitalSignsByPatient,
  getVitalSignById,
  createVitalSign,
  updateVitalSign,
  deleteVitalSign,
  getPatientVisitHistory,

  //added
  updateMedicalRecord,
  deleteMedicalRecord,
  getAllPrescriptionsByRecord,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getAllLabResultsByRecord,
  getLabResultById,
  createLabResult,
  updateLabResult,
  deleteLabResult,
  getAllCertificatesByRecord,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  getMedicalRecordByAppointmentId,

  //subscription
  getDoctorLimitStatus,
  getClinicLimitStatus,
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

// vital signs management
router.get(
  "/patient/:patientId/vitals",
  authMiddleware,
  requireUser,
  getAllVitalSignsByPatient,
);

router.get("/vitals/:vitalId", authMiddleware, requireUser, getVitalSignById);

router.post(
  "/patient/:patientId/vitals",
  authMiddleware,
  requireUser,
  createVitalSign,
);

router.patch("/vitals/:vitalId", authMiddleware, requireUser, updateVitalSign);

router.delete("/vitals/:vitalId", authMiddleware, requireUser, deleteVitalSign);

router.get(
  "/patient/:patientId/visit-history",
  authMiddleware,
  requireUser,
  getPatientVisitHistory,
);

// medical record
router.patch(
  "/medical-records/:recordId",
  authMiddleware,
  requireUser,
  updateMedicalRecord,
);

router.delete(
  "/medical-records/:recordId",
  authMiddleware,
  requireUser,
  deleteMedicalRecord,
);

// prescription
router.get(
  "/record/:recordId/prescriptions",
  authMiddleware,
  requireUser,
  getAllPrescriptionsByRecord,
);

router.get(
  "/prescriptions/:prescriptionId",
  authMiddleware,
  requireUser,
  getPrescriptionById,
);

router.post(
  "/record/:recordId/prescriptions",
  authMiddleware,
  requireUser,
  createPrescription,
);

router.patch(
  "/prescriptions/:prescriptionId",
  authMiddleware,
  requireUser,
  updatePrescription,
);

router.delete(
  "/prescriptions/:prescriptionId",
  authMiddleware,
  requireUser,
  deletePrescription,
);

// lab results
router.get(
  "/record/:recordId/lab-results",
  authMiddleware,
  requireUser,
  getAllLabResultsByRecord,
);

router.get(
  "/lab-results/:resultId",
  authMiddleware,
  requireUser,
  getLabResultById,
);

router.post(
  "/record/:recordId/lab-results",
  authMiddleware,
  requireUser,
  createLabResult,
);

router.patch(
  "/lab-results/:resultId",
  authMiddleware,
  requireUser,
  updateLabResult,
);

router.delete(
  "/lab-results/:resultId",
  authMiddleware,
  requireUser,
  deleteLabResult,
);

// certificates
router.get(
  "/record/:recordId/certificates",
  authMiddleware,
  requireUser,
  getAllCertificatesByRecord,
);

router.get(
  "/certificates/:certificateId",
  authMiddleware,
  requireUser,
  getCertificateById,
);

router.post(
  "/record/:recordId/certificates",
  authMiddleware,
  requireUser,
  createCertificate,
);

router.patch(
  "/certificates/:certificateId",
  authMiddleware,
  requireUser,
  updateCertificate,
);

router.delete(
  "/certificates/:certificateId",
  authMiddleware,
  requireUser,
  deleteCertificate,
);

router.get(
  "/appointment/:appointmentId/medical-record",
  authMiddleware,
  requireUser,
  getMedicalRecordByAppointmentId,
);

router.get("/limit-status", authMiddleware, requireUser, getDoctorLimitStatus);
router.get(
  "/limit-status/clinic",
  authMiddleware,
  requireUser,
  getClinicLimitStatus,
);
export default router;
