import PatientRepo from "../../infrastructure/PatientRepo.js";
import AppointmentFactory from "../../domain/factories/AppointmentFactory.js";
import PatientService from "../../application/services/PatientService.js";

import RegisterPatientDTO from "../http/RegisterPatientDTO.js";

// AUDIT
import AuditRepo from "../../../user/infrastructure/repositories/AuditRepo.js";
import AuditLogService from "../../../user/application/services/AuditLogService.js";

const patientRepo = new PatientRepo();
const factory = new AppointmentFactory();

const auditRepo = new AuditRepo();
const auditService = new AuditLogService(auditRepo);

const patientService = new PatientService(patientRepo, factory, auditService);

// =============================
// REGISTER PATIENT
// =============================
export const registerPatient = async (req, res) => {
  try {
    const dto = new RegisterPatientDTO(req.body);

    const patient = await patientService.registerPatient(dto, req.user);

    res.status(201).json({ success: true, patient });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// GET PATIENT BY ID
// =============================
export const getPatientById = async (req, res) => {
  try {
    const patientId = Number(req.params.id);
    const patient = await patientService.getPatientById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
      });
    }

    res.status(200).json({ success: true, patient });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// SEARCH PATIENTS
// =============================
export const searchPatients = async (req, res) => {
  try {
    const term = req.query.q || "";
    const patients = await patientService.searchPatients(term);

    res.status(200).json({ success: true, patients });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
