import DoctorSessionRepo from "../../infrastructure/DoctorSessionRepo.js";
import DoctorFactory from "../../domain/factories/DoctorFactory.js";
import DoctorSessionService from "../../application/services/DoctorSessionService.js";

import DoctorSessionDTO from "../http/dtos/DoctorSessionDTO.js";
import EditDoctorScheduleDTO from "../http/dtos/EditDoctorScheduleDTO.js";

import { asyncHandler } from "../../../../core/middleware/asyncHandler.js";
import { sendSuccess } from "../../../../core/http/apiResponse.js";

import eventBus from "../../../../core/events/EventBus.js";

// ============================================================
// DEPENDENCY WIRING
// ============================================================
const sessionRepo = new DoctorSessionRepo();
const factory = new DoctorFactory();
const sessionService = new DoctorSessionService(sessionRepo, factory, eventBus);

// ============================================================
// SET AVAILABILITY
// ============================================================
export const createDoctorSession = asyncHandler(async (req, res) => {
  const dto = new DoctorSessionDTO(req.body);
  const session = await sessionService.createDoctorSession(dto, req.user);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Doctor availability set",
    data: { session },
  });
});

// ============================================================
// EDIT SCHEDULE
// ============================================================
export const editSchedule = asyncHandler(async (req, res) => {
  const dto = new EditDoctorScheduleDTO({
    ...req.body,
    sessionId: Number(req.params.id),
  });

  const updated = await sessionService.editSchedule(dto, req.user);

  return sendSuccess(res, {
    message: "Doctor schedule updated",
    data: { updated },
  });
});

// ============================================================
// DELETE SCHEDULE
// ============================================================
export const deleteSession = asyncHandler(async (req, res) => {
  await sessionService.deleteSession(Number(req.params.sessionId), req.user);

  return sendSuccess(res, {
    message: "Doctor schedule deleted",
  });
});

// ============================================================
// GET DOCTOR SESSIONS
// ============================================================
export const getAllDoctorSessions = asyncHandler(async (req, res) => {
  const sessions = await sessionService.getAllDoctorSessions(
    Number(req.params.doctorId)
  );

  return sendSuccess(res, {
    data: { sessions },
  });
});

// ============================================================
// CHECK CONFLICTS
// ============================================================
export const checkConflicts = asyncHandler(async (req, res) => {
  const dto = new DoctorSessionDTO(req.body);
  const conflicts = await sessionService.checkConflicts(dto);

  return sendSuccess(res, {
    data: { conflicts },
  });
});

// ============================================================
// New & Updated APIs
// ============================================================
export const getDoctorScheduleInClinic = asyncHandler(async (req, res) => {
  const doctorId = Number(req.params.doctorId);
  const clinicId = Number(req.params.clinicId);

  const sessions = await sessionService.getDoctorScheduleInClinic(
    doctorId,
    clinicId
  );

  return sendSuccess(res, {
    data: { sessions },
  });
});
