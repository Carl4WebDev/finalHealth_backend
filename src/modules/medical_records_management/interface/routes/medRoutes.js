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
  updateLabResultImage,

  // prescription master
  getAllPrescriptionMasters,
  getPrescriptionMasterById,
  createPrescriptionMaster,
  updatePrescriptionMaster,
  deletePrescriptionMaster,

  // lab result master
  getAllLabResultMasters,
  getLabResultMasterById,
  createLabResultMaster,
  updateLabResultMaster,
  deleteLabResultMaster,

  // certificate master
  getAllCertificateMasters,
  getCertificateMasterById,
  createCertificateMaster,
  updateCertificateMaster,
  deleteCertificateMaster,
  updateCertificateImage,

  // fees master
  getAllFees,
  getFeeById,
  createFee,
  updateFee,
  deleteFee,

  //subscription
  getDoctorLimitStatus,
  getClinicLimitStatus,

} from "../controllers/MedController.js";

import { requireUser } from "../../../../core/middleware/requireUser.js";
import authMiddleware from "../../../../core/middleware/Auth.js";

import { uploadCertificate } from "../../../../core/middleware/uploadCertificate.js";

router.patch(
  "/certificates/:certificateId/image",
  authMiddleware,
  requireUser,
  uploadCertificate.single("certificate_image"),
  updateCertificateImage,
);

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

// prescription master
router.get(
  "/prescription-masters",
  authMiddleware,
  requireUser,
  getAllPrescriptionMasters,
);

router.get(
  "/prescription-masters/:prescriptionId",
  authMiddleware,
  requireUser,
  getPrescriptionMasterById,
);

router.post(
  "/prescription-masters",
  authMiddleware,
  requireUser,
  createPrescriptionMaster,
);

router.patch(
  "/prescription-masters/:prescriptionId",
  authMiddleware,
  requireUser,
  updatePrescriptionMaster,
);

router.delete(
  "/prescription-masters/:prescriptionId",
  authMiddleware,
  requireUser,
  deletePrescriptionMaster,
);

// lab result master
router.get(
  "/lab-result-masters",
  authMiddleware,
  requireUser,
  getAllLabResultMasters,
);

router.get(
  "/lab-result-masters/:labResultId",
  authMiddleware,
  requireUser,
  getLabResultMasterById,
);

router.post(
  "/lab-result-masters",
  authMiddleware,
  requireUser,
  createLabResultMaster,
);

router.patch(
  "/lab-result-masters/:labResultId",
  authMiddleware,
  requireUser,
  updateLabResultMaster,
);

router.delete(
  "/lab-result-masters/:labResultId",
  authMiddleware,
  requireUser,
  deleteLabResultMaster,
);

// certificate master
router.get(
  "/certificate-masters",
  authMiddleware,
  requireUser,
  getAllCertificateMasters,
);

router.get(
  "/certificate-masters/:certificateId",
  authMiddleware,
  requireUser,
  getCertificateMasterById,
);

router.post(
  "/certificate-masters",
  authMiddleware,
  requireUser,
  createCertificateMaster,
);

router.patch(
  "/certificate-masters/:certificateId",
  authMiddleware,
  requireUser,
  updateCertificateMaster,
);

router.delete(
  "/certificate-masters/:certificateId",
  authMiddleware,
  requireUser,
  deleteCertificateMaster,
);

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

import { uploadLabResult } from "../../../../core/middleware/uploadLabResult.js";

router.post(
  "/record/:recordId/lab-results",
  authMiddleware,
  requireUser,
  uploadLabResult.single("lab_image"),
  createLabResult,
);

router.patch(
  "/lab-results/:labResultId/image",
  authMiddleware,
  requireUser,
  uploadLabResult.single("lab_image"),
  updateLabResultImage,
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

// fees master
router.get("/fees", authMiddleware, requireUser, getAllFees);

router.get("/fees/:feeId", authMiddleware, requireUser, getFeeById);

router.post("/fees", authMiddleware, requireUser, createFee);

router.patch("/fees/:feeId", authMiddleware, requireUser, updateFee);

router.delete("/fees/:feeId", authMiddleware, requireUser, deleteFee);

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
