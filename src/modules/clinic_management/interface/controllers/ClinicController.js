/**
 * CLINIC CONTROLLER (GLOBAL ERROR HANDLING)
 *
 * - No try/catch
 * - Errors bubble via asyncHandler → errorHandler
 * - Controllers orchestrate only
 */

import ClinicRepo from "../../infrastructure/ClinicRepo.js";
import DoctorFactory from "../../domain/factories/DoctorFactory.js";
import ClinicManagementService from "../../application/services/ClinicManagementService.js";

import RegisterClinicDTO from "../http/dtos/RegisterClinicDTO.js";

import { asyncHandler } from "../../../../core/middleware/asyncHandler.js";
import { sendSuccess } from "../../../../core/http/apiResponse.js";

import eventBus from "../../../../core/events/EventBus.js";

// Wiring
const clinicRepo = new ClinicRepo();
const factory = new DoctorFactory();

const clinicService = new ClinicManagementService(
  clinicRepo,
  factory,
  eventBus
);

// ============================================================
// REGISTER CLINIC
// ============================================================
export const registerClinic = asyncHandler(async (req, res) => {
  const dto = new RegisterClinicDTO(req.body);
  const clinic = await clinicService.registerClinic(dto, req.user);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Clinic registered successfully",
    data: { clinic },
  });
});

// ============================================================
// APPROVE CLINIC
// ============================================================
export const approveClinic = asyncHandler(async (req, res) => {
  const clinicId = Number(req.params.id);

  await clinicService.approveClinic(clinicId, req.user);

  return sendSuccess(res, {
    message: "Clinic approved",
  });
});

// ============================================================
// REJECT CLINIC
// ============================================================
export const rejectClinic = asyncHandler(async (req, res) => {
  const clinicId = Number(req.params.id);
  const { reason } = req.body;

  await clinicService.rejectClinic(clinicId, req.user, reason);

  return sendSuccess(res, {
    message: "Clinic rejected",
  });
});

// ============================================================
// GET CLINIC BY ID
// ============================================================
export const getClinicById = asyncHandler(async (req, res) => {
  const clinicId = Number(req.params.id);
  const clinic = await clinicService.getClinicById(clinicId);

  return sendSuccess(res, {
    data: { clinic },
  });
});

// ============================================================
// GET PENDING CLINICS
// ============================================================
export const getPendingClinics = asyncHandler(async (req, res) => {
  const clinics = await clinicService.getPendingClinics();

  return sendSuccess(res, {
    data: { clinics },
  });
});

// ============================================================
// GET ALL CLINICS (READ-ONLY)
// ============================================================
export const getAllClinics = asyncHandler(async (req, res) => {
  const clinics = await clinicRepo.getAllClinics();

  return sendSuccess(res, {
    data: { clinics },
  });
});
