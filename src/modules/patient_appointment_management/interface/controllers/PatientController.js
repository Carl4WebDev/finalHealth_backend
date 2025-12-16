/**
 * PATIENT CONTROLLER
 * - No try/catch
 * - asyncHandler only
 * - Orchestration only
 */

import PatientRepo from "../../infrastructure/PatientRepo.js";
import PatientFactory from "../../domain/factories/PatientFactory.js";
import PatientManagementService from "../../application/services/PatientService.js";

import RegisterPatientDTO from "../http/RegisterPatientDTO.js";
import UpdatePatientDTO from "../http/UpdatePatientDTO.js";

import { asyncHandler } from "../../../../core/middleware/asyncHandler.js";
import { sendSuccess } from "../../../../core/http/apiResponse.js";

import eventBus from "../../../../core/events/EventBus.js";

// Wiring
const patientRepo = new PatientRepo();
const factory = new PatientFactory();

const patientService = new PatientManagementService(
  patientRepo,
  factory,
  eventBus
);

// ============================================================
// REGISTER PATIENT
// ============================================================
export const registerPatient = asyncHandler(async (req, res) => {
  const dto = new RegisterPatientDTO(req.body);
  const patient = await patientService.registerPatient(dto, req.user);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Patient registered successfully",
    data: { patient },
  });
});

// ============================================================
// UPDATE PATIENT
// ============================================================
export const updatePatient = asyncHandler(async (req, res) => {
  const patientId = Number(req.params.id);
  const dto = new UpdatePatientDTO(req.body);

  const patient = await patientService.updatePatient(patientId, dto, req.user);

  return sendSuccess(res, {
    message: "Patient updated successfully",
    data: { patient },
  });
});

// ============================================================
// GET PATIENT BY ID
// ============================================================
export const getPatientById = asyncHandler(async (req, res) => {
  const patientId = Number(req.params.id);
  const patient = await patientService.getPatientById(patientId);

  return sendSuccess(res, {
    data: { patient },
  });
});

// ============================================================
// SEARCH PATIENTS
// ============================================================
export const searchPatients = asyncHandler(async (req, res) => {
  const term = req.query.q || "";
  const patients = await patientService.searchPatients(term);

  return sendSuccess(res, {
    data: { patients },
  });
});

// ============================================================
// GET ALL PATIENTS
// ============================================================
export const getAllPatients = asyncHandler(async (req, res) => {
  const patients = await patientService.getAllPatients();

  return sendSuccess(res, {
    data: { patients },
  });
});
