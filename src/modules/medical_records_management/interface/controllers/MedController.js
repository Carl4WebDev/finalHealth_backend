import { asyncHandler } from "../../../../core/middleware/asyncHandler.js";
import { sendSuccess } from "../../../../core/http/apiResponse.js";

import MedService from "../../application/services/MedService.js";
import MedRepo from "../../infrastructure/MedRepo.js";

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
