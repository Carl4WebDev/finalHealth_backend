import PatientRepo from "../../infrastructure/PatientRepo.js";
import AppointmentFactory from "../../domain/factories/AppointmentFactory.js";
import PatientService from "../../application/services/PatientService.js";

import RegisterPatientDTO from "../http/RegisterPatientDTO.js";

// Dependency Injection — same pattern you use in ClinicController
const patientRepo = new PatientRepo();
const factory = new AppointmentFactory();
const patientService = new PatientService(patientRepo, factory);

// =============================
// REGISTER PATIENT
// =============================
export const registerPatient = async (req, res) => {
  try {
    const dto = new RegisterPatientDTO(req.body);
    const patient = await patientService.registerPatient(dto);
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
      return res
        .status(404)
        .json({ success: false, error: "Patient not found" });
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
