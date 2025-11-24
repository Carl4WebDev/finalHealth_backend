import DoctorRepo from "../../infrastructure/DoctorRepo.js";
import ClinicRepo from "../../infrastructure/ClinicRepo.js";
import DoctorFactory from "../../domain/factories/DoctorFactory.js";

import DoctorManagementService from "../../application/services/DoctorManagementService.js";

import RegisterDoctorDTO from "../http/dtos/RegisterDoctorDTO.js";

// AUDIT
import AuditRepo from "../../../user/infrastructure/repositories/AuditRepo.js";
import AuditLogService from "../../../user/application/services/AuditLogService.js";

// Instantiate dependencies
const doctorRepo = new DoctorRepo();
const clinicRepo = new ClinicRepo();
const factory = new DoctorFactory();

const auditRepo = new AuditRepo();
const auditService = new AuditLogService(auditRepo);

const doctorService = new DoctorManagementService(
  doctorRepo,
  clinicRepo,
  factory,
  auditService
);

export const registerDoctor = async (req, res) => {
  try {
    const dto = new RegisterDoctorDTO(req.body);

    const doctor = await doctorService.registerDoctor(dto, req.user);

    res.status(201).json({ success: true, doctor });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const approveDoctor = async (req, res) => {
  try {
    const doctorId = Number(req.params.id);

    await doctorService.approveDoctor(doctorId, req.user);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const rejectDoctor = async (req, res) => {
  try {
    const doctorId = Number(req.params.id);
    const { reason } = req.body;

    await doctorService.rejectDoctor(doctorId, req.user, reason);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const assignDoctorToClinic = async (req, res) => {
  try {
    const doctorId = Number(req.params.id);
    const clinicId = Number(req.body.clinicId);

    await doctorService.assignDoctorToClinic(doctorId, clinicId, req.user);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
