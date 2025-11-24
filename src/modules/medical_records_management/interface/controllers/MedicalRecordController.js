import MedicalRecordRepo from "../../infrastructure/MedicalRecordRepo.js";
import MedicalRecordService from "../../application/services/MedicalRecordService.js";

import CreateMedicalRecordDTO from "../http/dtos/CreateMedicalRecordDTO.js";
import UpdateMedicalRecordDTO from "../http/dtos/UpdateMedicalRecordDTO.js";

// 🔵 AUDIT
import AuditRepo from "../../../user/infrastructure/repositories/AuditRepo.js";
import AuditLogService from "../../../user/application/services/AuditLogService.js";

// DI
const medicalRecordRepo = new MedicalRecordRepo();
const auditRepo = new AuditRepo();
const auditService = new AuditLogService(auditRepo);

const medicalRecordService = new MedicalRecordService(
  medicalRecordRepo,
  auditService
);

// CREATE
export const createMedicalRecord = async (req, res) => {
  try {
    const dto = new CreateMedicalRecordDTO(req.body);

    const record = await medicalRecordService.createMedicalRecord(
      dto,
      req.user
    );

    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// UPDATE
export const updateMedicalRecord = async (req, res) => {
  try {
    const dto = new UpdateMedicalRecordDTO(req.body, req.params);

    const record = await medicalRecordService.updateMedicalRecord(
      dto,
      req.user
    );

    res.status(200).json({ success: true, record });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// GET BY ID
export const getMedicalRecordById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const record = await medicalRecordService.getById(id);

    if (!record) {
      return res
        .status(404)
        .json({ success: false, error: "Medical record not found" });
    }

    res.status(200).json({ success: true, record });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// LIST BY APPOINTMENT
export const listMedicalRecordsByAppointment = async (req, res) => {
  try {
    const appointmentId = Number(req.params.appointmentId);
    const records = await medicalRecordService.listByAppointment(appointmentId);

    res.status(200).json({ success: true, records });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// LIST BY PATIENT
export const listMedicalRecordsByPatient = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);
    const records = await medicalRecordService.listByPatient(patientId);

    res.status(200).json({ success: true, records });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
