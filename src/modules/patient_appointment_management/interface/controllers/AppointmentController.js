import AppointmentRepo from "../../infrastructure/AppointmentRepo.js";
import PatientRepo from "../../infrastructure/PatientRepo.js";
import PriorityRepo from "../../infrastructure/PriorityRepo.js";
import AppointmentFactory from "../../domain/factories/AppointmentFactory.js";
import AppointmentService from "../../application/services/AppointmentService.js";

import CreateAppointmentDTO from "../http/CreateAppointmentDTO.js";
import RescheduleAppointmentDTO from "../http/RescheduleAppointmentDTO.js";

// 🔵 AUDIT IMPORTS — ONLY ADDITION
import AuditRepo from "../../../user/infrastructure/repositories/AuditRepo.js";
import AuditLogService from "../../../user/application/services/AuditLogService.js";

// Dependency Injection — original
const appointmentRepo = new AppointmentRepo();
const patientRepo = new PatientRepo();
const priorityRepo = new PriorityRepo();
const factory = new AppointmentFactory();

// 🔵 AUDIT INJECTION — ONLY ADDITION
const auditRepo = new AuditRepo();
const auditService = new AuditLogService(auditRepo);

// 🔵 inject auditService into AppointmentService — ONLY CHANGE
const appointmentService = new AppointmentService(
  appointmentRepo,
  patientRepo,
  priorityRepo,
  factory,
  auditService
);

// =============================
// CREATE APPOINTMENT
// =============================
export const createAppointment = async (req, res) => {
  try {
    const dto = new CreateAppointmentDTO(req.body);

    // 🔵 ONLY CHANGE: pass actor
    const appointment = await appointmentService.createAppointment(
      dto,
      req.user
    );

    res.status(201).json({ success: true, appointment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// RESCHEDULE
// =============================
export const rescheduleAppointment = async (req, res) => {
  try {
    const dto = new RescheduleAppointmentDTO(req.body, req.params);

    // 🔵 ONLY CHANGE: pass actor
    const appointment = await appointmentService.rescheduleAppointment(
      dto,
      req.user
    );

    res.status(200).json({ success: true, appointment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// CANCEL
// =============================
export const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = Number(req.params.id);
    const { reason } = req.body;

    // 🔵 ONLY CHANGE: pass actor
    const appointment = await appointmentService.cancelAppointment(
      appointmentId,
      reason,
      req.user
    );

    res.status(200).json({ success: true, appointment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// COMPLETE
// =============================
export const completeAppointment = async (req, res) => {
  try {
    const appointmentId = Number(req.params.id);

    // 🔵 ONLY CHANGE: pass actor
    const appointment = await appointmentService.completeAppointment(
      appointmentId,
      req.user
    );

    res.status(200).json({ success: true, appointment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// LIST BY DATE RANGE
// =============================
export const listAppointmentsByDate = async (req, res) => {
  try {
    const clinicId = Number(req.query.clinicId);
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;

    const appointments = await appointmentService.listAppointmentsByDateRange(
      clinicId,
      fromDate,
      toDate
    );

    res.status(200).json({ success: true, appointments });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// LIST BY PATIENT
// =============================
export const listAppointmentsByPatient = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);

    const appointments = await appointmentService.listAppointmentsByPatient(
      patientId
    );

    res.status(200).json({ success: true, appointments });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// GET APPOINTMENT BY ID
// =============================
export const getAppointmentById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const appointment = await appointmentService.getAppointmentById(id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, error: "Appointment not found" });
    }

    res.status(200).json({ success: true, appointment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
