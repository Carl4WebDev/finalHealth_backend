import AppointmentRepo from "../../infrastructure/repositories/AppointmentRepo.js";
import PatientRepo from "../../infrastructure/repositories/PatientRepo.js";
import PriorityRepo from "../../infrastructure/repositories/PriorityRepo.js";
import AppointmentFactory from "../../domain/factories/AppointmentFactory.js";
import AppointmentService from "../../application/services/AppointmentService.js";

import CreateAppointmentDTO from "../http/dtos/CreateAppointmentDTO.js";
import RescheduleAppointmentDTO from "../http/dtos/RescheduleAppointmentDTO.js";

// Dependency Injection — following exact pattern from ClinicController
const appointmentRepo = new AppointmentRepo();
const patientRepo = new PatientRepo();
const priorityRepo = new PriorityRepo();
const factory = new AppointmentFactory();

const appointmentService = new AppointmentService(
  appointmentRepo,
  patientRepo,
  priorityRepo,
  factory
);

// =============================
// CREATE APPOINTMENT
// =============================
export const createAppointment = async (req, res) => {
  try {
    const dto = new CreateAppointmentDTO(req.body);
    const appointment = await appointmentService.createAppointment(dto);
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
    const appointment = await appointmentService.rescheduleAppointment(dto);
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
    const appointment = await appointmentService.cancelAppointment(
      appointmentId,
      reason
    );

    res.status(200).json({ success: true, appointment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// COMPLETE APPOINTMENT
// =============================
export const completeAppointment = async (req, res) => {
  try {
    const appointmentId = Number(req.params.id);
    const appointment = await appointmentService.completeAppointment(
      appointmentId
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
