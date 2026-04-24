import { asyncHandler } from "../../../../core/middleware/asyncHandler.js";
import { sendSuccess } from "../../../../core/http/apiResponse.js";
import AppError from "../../../../core/errors/AppError.js";

import MedService from "../../application/services/MedService.js";
import MedRepo from "../../infrastructure/MedRepo.js";

import SubscriptionLimitService from "../../../../core/subscription/SubscriptionLimitService.js";
const medRepo = new MedRepo();

const medService = new MedService(medRepo);
export const getPatientOfDoctorInClinic = asyncHandler(async (req, res) => {
  const doctorId = Number(req.params.doctorId);
  const clinicId = Number(req.params.clinicId);
  const userId = Number(req.user.id);

  const patients = await medService.getPatientOfDoctorInClinic(
    doctorId,
    clinicId,
    userId,
  );

  return sendSuccess(res, {
    data: { patients },
  });
});

export const getPatientInfo = asyncHandler(async (req, res) => {
  const patientId = Number(req.params.patientId);
  const patientInfo = await medService.getPatientInfo(patientId);

  return sendSuccess(res, {
    data: { patientInfo },
  });
});

export const getPatientMedicalRecords = asyncHandler(async (req, res) => {
  const patientId = Number(req.params.patientId);
  const patientMedRec = await medService.getPatientMedicalRecords(patientId);

  return sendSuccess(res, {
    data: { patientMedRec },
  });
});

export const getMedicalRecordsFullDetails = asyncHandler(async (req, res) => {
  const recordId = Number(req.params.recordId);
  const patientMedRecDetail =
    await medService.getMedicalRecordsFullDetails(recordId);

  return sendSuccess(res, {
    data: { patientMedRecDetail },
  });
});

export const createMedicalRecord = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const record = await medService.createMedicalRecord(
    patientId,
    req.body,
    req.user,
  );

  return sendSuccess(res, {
    statusCode: 201,
    message: "Medical record created successfully",
    data: { record },
  });
});

export const uploadMedicalRecordDocuments = asyncHandler(async (req, res) => {
  const { recordId } = req.params;

  if (!req.files || req.files.length === 0) {
    throw new AppError("No images uploaded", 400);
  }

  await medService.addDocuments(recordId, req.files, req.user);

  return sendSuccess(res, {
    message: "Medical record images uploaded",
  });
});

// Diagnosis
export const getAllDiagnoses = asyncHandler(async (req, res) => {
  const diagnoses = await medService.getAllDiagnoses(req.user);

  return sendSuccess(res, {
    message: "Diagnoses fetched successfully",
    data: { diagnoses },
  });
});

export const createDiagnosis = asyncHandler(async (req, res) => {
  const diagnosis = await medService.createDiagnosis(req.body, req.user);

  return sendSuccess(res, {
    message: "Diagnosis created successfully",
    data: { diagnosis },
  });
});

export const updateDiagnosis = asyncHandler(async (req, res) => {
  const diagnosisId = Number(req.params.id);
  const diagnosis = await medService.updateDiagnosis(
    diagnosisId,
    req.body,
    req.user,
  );

  return sendSuccess(res, {
    message: "Diagnosis updated successfully",
    data: { diagnosis },
  });
});

export const deleteDiagnosis = asyncHandler(async (req, res) => {
  const diagnosisId = Number(req.params.id);
  await medService.deleteDiagnosis(diagnosisId, req.user);

  return sendSuccess(res, {
    message: "Diagnosis deleted successfully",
    data: null,
  });
});

// Treatment
export const getAllTreatments = asyncHandler(async (req, res) => {
  const treatments = await medService.getAllTreatments(req.user);

  return sendSuccess(res, {
    message: "Treatments fetched successfully",
    data: { treatments },
  });
});

export const createTreatment = asyncHandler(async (req, res) => {
  const treatment = await medService.createTreatment(req.body, req.user);

  return sendSuccess(res, {
    message: "Treatment created successfully",
    data: { treatment },
  });
});

export const updateTreatment = asyncHandler(async (req, res) => {
  const treatmentId = Number(req.params.id);
  const treatment = await medService.updateTreatment(
    treatmentId,
    req.body,
    req.user,
  );

  return sendSuccess(res, {
    message: "Treatment updated successfully",
    data: { treatment },
  });
});

export const deleteTreatment = asyncHandler(async (req, res) => {
  const treatmentId = Number(req.params.id);
  await medService.deleteTreatment(treatmentId, req.user);

  return sendSuccess(res, {
    message: "Treatment deleted successfully",
    data: null,
  });
});

// Vital Signs
export const getAllVitalSignsByPatient = asyncHandler(async (req, res) => {
  const patientId = Number(req.params.patientId);

  const vitalSigns = await medService.getAllVitalSignsByPatient(
    patientId,
    req.user,
  );

  return sendSuccess(res, {
    message: "Vital signs fetched successfully",
    data: { vitalSigns },
  });
});

export const getVitalSignById = asyncHandler(async (req, res) => {
  const vitalId = Number(req.params.vitalId);

  const vitalSign = await medService.getVitalSignById(vitalId, req.user);

  return sendSuccess(res, {
    message: "Vital sign fetched successfully",
    data: { vitalSign },
  });
});

export const createVitalSign = asyncHandler(async (req, res) => {
  const patientId = Number(req.params.patientId);

  const vitalSign = await medService.createVitalSign(
    patientId,
    req.body,
    req.user,
  );

  return sendSuccess(res, {
    statusCode: 201,
    message: "Vital sign created successfully",
    data: { vitalSign },
  });
});

export const updateVitalSign = asyncHandler(async (req, res) => {
  const vitalId = Number(req.params.vitalId);

  const vitalSign = await medService.updateVitalSign(
    vitalId,
    req.body,
    req.user,
  );

  return sendSuccess(res, {
    message: "Vital sign updated successfully",
    data: { vitalSign },
  });
});

export const deleteVitalSign = asyncHandler(async (req, res) => {
  const vitalId = Number(req.params.vitalId);

  await medService.deleteVitalSign(vitalId, req.user);

  return sendSuccess(res, {
    message: "Vital sign deleted successfully",
    data: null,
  });
});

/* NEW */
export const getPatientVisitHistory = asyncHandler(async (req, res) => {
  const patientId = Number(req.params.patientId);
  const userId = Number(req.user.id);

  console.log("med", patientId);
  console.log("med", userId);

  const visitHistory = await medService.getPatientVisitHistory(
    patientId,
    userId,
  );

  return sendSuccess(res, {
    message: "Patient visit history fetched successfully",
    data: { visitHistory },
  });
});

// medical record
export const updateMedicalRecord = asyncHandler(async (req, res) => {
  const recordId = Number(req.params.recordId);

  const record = await medService.updateMedicalRecord(
    recordId,
    req.body,
    req.user,
  );

  return sendSuccess(res, {
    message: "Medical record updated successfully",
    data: { record },
  });
});

export const deleteMedicalRecord = asyncHandler(async (req, res) => {
  const recordId = Number(req.params.recordId);

  await medService.deleteMedicalRecord(recordId, req.user);

  return sendSuccess(res, {
    message: "Medical record deleted successfully",
    data: null,
  });
});

// prescriptions
export const getAllPrescriptionsByRecord = asyncHandler(async (req, res) => {
  const recordId = Number(req.params.recordId);

  const prescriptions = await medService.getAllPrescriptionsByRecord(
    recordId,
    req.user,
  );

  return sendSuccess(res, {
    message: "Prescriptions fetched successfully",
    data: { prescriptions },
  });
});

export const getPrescriptionById = asyncHandler(async (req, res) => {
  const prescriptionId = Number(req.params.prescriptionId);

  const prescription = await medService.getPrescriptionById(
    prescriptionId,
    req.user,
  );

  return sendSuccess(res, {
    message: "Prescription fetched successfully",
    data: { prescription },
  });
});

export const createPrescription = asyncHandler(async (req, res) => {
  const recordId = Number(req.params.recordId);

  const prescription = await medService.createPrescription(
    recordId,
    req.body,
    req.user,
  );

  return sendSuccess(res, {
    statusCode: 201,
    message: "Prescription created successfully",
    data: { prescription },
  });
});

export const updatePrescription = asyncHandler(async (req, res) => {
  const prescriptionId = Number(req.params.prescriptionId);

  const prescription = await medService.updatePrescription(
    prescriptionId,
    req.body,
    req.user,
  );

  return sendSuccess(res, {
    message: "Prescription updated successfully",
    data: { prescription },
  });
});

export const deletePrescription = asyncHandler(async (req, res) => {
  const prescriptionId = Number(req.params.prescriptionId);

  await medService.deletePrescription(prescriptionId, req.user);

  return sendSuccess(res, {
    message: "Prescription deleted successfully",
    data: null,
  });
});

// lab results
export const getAllLabResultsByRecord = asyncHandler(async (req, res) => {
  const recordId = Number(req.params.recordId);

  const labResults = await medService.getAllLabResultsByRecord(
    recordId,
    req.user,
  );

  return sendSuccess(res, {
    message: "Lab results fetched successfully",
    data: { labResults },
  });
});

export const getLabResultById = asyncHandler(async (req, res) => {
  const resultId = Number(req.params.resultId);

  const labResult = await medService.getLabResultById(resultId, req.user);

  return sendSuccess(res, {
    message: "Lab result fetched successfully",
    data: { labResult },
  });
});

export const createLabResult = asyncHandler(async (req, res) => {
  const recordId = Number(req.params.recordId);

  const labResult = await medService.createLabResult(
    recordId,
    req.body,
    req.user,
  );

  return sendSuccess(res, {
    statusCode: 201,
    message: "Lab result created successfully",
    data: { labResult },
  });
});

export const updateLabResult = asyncHandler(async (req, res) => {
  const resultId = Number(req.params.resultId);

  const labResult = await medService.updateLabResult(
    resultId,
    req.body,
    req.user,
  );

  return sendSuccess(res, {
    message: "Lab result updated successfully",
    data: { labResult },
  });
});

export const deleteLabResult = asyncHandler(async (req, res) => {
  const resultId = Number(req.params.resultId);

  await medService.deleteLabResult(resultId, req.user);

  return sendSuccess(res, {
    message: "Lab result deleted successfully",
    data: null,
  });
});

// certificates
export const getAllCertificatesByRecord = asyncHandler(async (req, res) => {
  const recordId = Number(req.params.recordId);

  const certificates = await medService.getAllCertificatesByRecord(
    recordId,
    req.user,
  );

  return sendSuccess(res, {
    message: "Certificates fetched successfully",
    data: { certificates },
  });
});

export const getCertificateById = asyncHandler(async (req, res) => {
  const certificateId = Number(req.params.certificateId);

  const certificate = await medService.getCertificateById(
    certificateId,
    req.user,
  );

  return sendSuccess(res, {
    message: "Certificate fetched successfully",
    data: { certificate },
  });
});

export const createCertificate = asyncHandler(async (req, res) => {
  const recordId = Number(req.params.recordId);

  const certificate = await medService.createCertificate(
    recordId,
    req.body,
    req.user,
  );

  return sendSuccess(res, {
    statusCode: 201,
    message: "Certificate created successfully",
    data: { certificate },
  });
});

export const updateCertificate = asyncHandler(async (req, res) => {
  const certificateId = Number(req.params.certificateId);

  const certificate = await medService.updateCertificate(
    certificateId,
    req.body,
    req.user,
  );

  return sendSuccess(res, {
    message: "Certificate updated successfully",
    data: { certificate },
  });
});

export const deleteCertificate = asyncHandler(async (req, res) => {
  const certificateId = Number(req.params.certificateId);

  await medService.deleteCertificate(certificateId, req.user);

  return sendSuccess(res, {
    message: "Certificate deleted successfully",
    data: null,
  });
});

export const getMedicalRecordByAppointmentId = asyncHandler(
  async (req, res) => {
    const appointmentId = Number(req.params.appointmentId);

    const medicalRecord = await medService.getMedicalRecordByAppointmentId(
      appointmentId,
      req.user,
    );

    return sendSuccess(res, {
      message: "Medical record by appointment fetched successfully",
      data: { medicalRecord },
    });
  },
);

export const getDoctorLimitStatus = asyncHandler(async (req, res) => {
  const userId = Number(req.user.id);

  const limitStatus =
    await SubscriptionLimitService.getDoctorLimitStatus(userId);

  return sendSuccess(res, {
    statusCode: 200,
    message: "Doctor limit status fetched successfully",
    data: limitStatus,
  });
});

export const getClinicLimitStatus = asyncHandler(async (req, res) => {
  const userId = Number(req.user.id);

  const data = await SubscriptionLimitService.getClinicLimitStatus(userId);

  return sendSuccess(res, {
    statusCode: 200,
    message: "Clinic limit status fetched",
    data,
  });
});
