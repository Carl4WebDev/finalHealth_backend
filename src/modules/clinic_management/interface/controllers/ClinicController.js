import ClinicRepo from "../../infrastructure/ClinicRepo.js";
import DoctorFactory from "../../domain/factories/DoctorFactory.js";
import ClinicManagementService from "../../application/services/ClinicManagementService.js";

import RegisterClinicDTO from "../http/dtos/RegisterClinicDTO.js";

import AuditRepo from "../../../user/infrastructure/repositories/AuditRepo.js";
import AuditLogService from "../../../user/application/services/AuditLogService.js";

// Instantiate repos
const clinicRepo = new ClinicRepo();
const factory = new DoctorFactory();
const auditRepo = new AuditRepo();
const auditService = new AuditLogService(auditRepo);

// Pass auditService into the service
const clinicService = new ClinicManagementService(
  clinicRepo,
  factory,
  auditService
);

export const registerClinic = async (req, res) => {
  try {
    const dto = new RegisterClinicDTO(req.body);

    // Pass actor into service
    const clinic = await clinicService.registerClinic(dto, req.user);

    res.status(201).json({ success: true, clinic });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const approveClinic = async (req, res) => {
  try {
    const clinicId = Number(req.params.id);

    await clinicService.approveClinic(clinicId, req.user);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const rejectClinic = async (req, res) => {
  try {
    const clinicId = Number(req.params.id);

    await clinicService.rejectClinic(clinicId, req.user, req.body.reason);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getClinicById = async (req, res) => {
  try {
    const clinicId = Number(req.params.id);
    const clinic = await clinicService.getClinicById(clinicId);

    if (!clinic)
      return res
        .status(404)
        .json({ success: false, error: "Clinic not found" });

    res.status(200).json({ success: true, clinic });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getPendingClinics = async (req, res) => {
  try {
    const clinics = await clinicService.getPendingClinics();
    res.status(200).json({ success: true, clinics });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getAllClinics = async (req, res) => {
  try {
    const clinics = await clinicRepo.getAllClinics();
    res.status(200).json({ success: true, clinics });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
