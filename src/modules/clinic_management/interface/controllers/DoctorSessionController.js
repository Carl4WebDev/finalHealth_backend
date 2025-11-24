import DoctorSessionRepo from "../../infrastructure/DoctorSessionRepo.js";
import DoctorFactory from "../../domain/factories/DoctorFactory.js";
import DoctorSessionService from "../../application/services/DoctorSessionService.js";

import DoctorSessionDTO from "../http/dtos/DoctorSessionDTO.js";
import EditDoctorScheduleDTO from "../http/dtos/EditDoctorScheduleDTO.js";

// AUDIT
import AuditRepo from "../../../user/infrastructure/repositories/AuditRepo.js";
import AuditLogService from "../../../user/application/services/AuditLogService.js";

// Instantiate dependencies
const sessionRepo = new DoctorSessionRepo();
const factory = new DoctorFactory();
const auditRepo = new AuditRepo();
const auditService = new AuditLogService(auditRepo);

const sessionService = new DoctorSessionService(
  sessionRepo,
  factory,
  auditService
);

export const setAvailability = async (req, res) => {
  try {
    const dto = new DoctorSessionDTO(req.body);
    const session = await sessionService.setAvailabilityWindow(dto, req.user);
    res.status(201).json({ success: true, session });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const editSchedule = async (req, res) => {
  try {
    const dto = new EditDoctorScheduleDTO(req.body);
    dto.sessionId = Number(req.params.id);

    const updated = await sessionService.editSchedule(dto, req.user);

    res.status(200).json({ success: true, updated });
  } catch (err) {
    console.log("here error");
    res.status(400).json({ success: false, error: err.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await sessionService.deleteSchedule(id, req.user);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getDoctorSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getDoctorSessions(
      Number(req.params.doctorId)
    );
    res.status(200).json({ success: true, sessions });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const checkConflicts = async (req, res) => {
  try {
    const dto = new DoctorSessionDTO(req.body);
    const conflicts = await sessionService.checkConflicts(dto);
    res.status(200).json({ success: true, conflicts });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
