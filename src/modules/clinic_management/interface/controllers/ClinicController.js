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
  const clinics = await clinicRepo.getAllClinics(req.user.id);

  return sendSuccess(res, {
    data: { clinics },
  });
});

// ============================================================
// New & Planned api calls
// ============================================================

export const getAllClinicsOfDoctor = async (req, res) => {
  try {
    const doctorId = Number(req.params.doctorId);
    const clinics = await clinicService.getAllClinicsOfDoctor(
      doctorId,
      req.user.id
    );
    res.status(200).json({
      success: true,
      data: clinics,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

export const getAllClinicsOfUserNotAffiliated = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const clinics = await clinicService.getAllClinicsOfUserNotAffiliated(
      doctorId,
      req.user.id
    );
    res.status(200).json({
      success: true,
      data: clinics,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};
export const getClinicSessions = async (req, res) => {
  try {
    const clinicId = req.params.clinicId;

    const clinicSessions = await clinicService.getClinicSessions(clinicId);

    res.status(200).json({
      success: true,
      data: clinicSessions,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

export const createAffiliationDoctorToClinic = asyncHandler(
  async (req, res) => {
    const doctorId = req.params.doctorId;
    const clinicId = req.params.clinicId;

    const affiliated = await clinicService.createAffiliationDoctorToClinic(
      doctorId,
      clinicId
    );

    return sendSuccess(res, {
      statusCode: 201,
      message: "Affliated doctor to clinic successfully!",
      data: { affiliated },
    });
  }
);
export const createClinicSession = asyncHandler(async (req, res) => {
  const clinicId = req.params.clinicId;
  const clinicSessionData = req.body;

  const session = await clinicService.createClinicSession(
    clinicId,
    clinicSessionData
  );

  return sendSuccess(res, {
    statusCode: 201,
    message: "Created clinic session successfully!",
    data: { session },
  });
});

export const deleteClinicAffiliation = asyncHandler(async (req, res) => {
  const doctorId = req.params.doctorId;
  const clinicId = req.params.clinicId;

  const unaffiliate = await clinicService.deleteClinicAffiliation(
    doctorId,
    clinicId
  );

  return sendSuccess(res, {
    statusCode: 204,
    message: "Unaffliated doctor to clinic successfully!",
    data: { unaffiliate },
  });
});
export const deleteClinicSession = asyncHandler(async (req, res) => {
  const sessionId = req.params.sessionId;

  const session = await clinicService.deleteClinicSession(sessionId);

  return sendSuccess(res, {
    statusCode: 204,
    message: "Session deleted successfully!",
    data: { session },
  });
});

export const getClinicInfo = asyncHandler(async (req, res) => {
  const clinicId = Number(req.params.clinicId);
  const clinic = await clinicRepo.getClinicInfo(clinicId);

  return sendSuccess(res, {
    data: { clinic },
  });
});

export const updateClinicInfo = asyncHandler(async (req, res) => {
  const clinicId = Number(req.params.clinicId);
  const clinicData = req.body;

  const clinic = await clinicRepo.updateClinicInfo(clinicId, clinicData);

  return sendSuccess(res, {
    statusCode: 200,
    message: "Clinic updated successfully",
    data: { clinic },
  });
});
