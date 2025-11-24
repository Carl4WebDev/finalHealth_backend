import LabResultRepo from "../../infrastructure/LabResultRepo.js";
import LabResultService from "../../application/services/LabResultService.js";

import CreateLabResultDTO from "../http/dtos/CreateLabResultDTO.js";
import UpdateLabResultDTO from "../http/dtos/UpdateLabResultDTO.js";

// Dependency Injection (same pattern as ClinicController)
const labResultRepo = new LabResultRepo();
const labResultService = new LabResultService(labResultRepo);

// =============================
// CREATE
// =============================
export const createLabResult = async (req, res) => {
  try {
    const dto = new CreateLabResultDTO(req.body);
    const labResult = await labResultService.createLabResult(dto);
    res.status(201).json({ success: true, labResult });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// UPDATE
// =============================
export const updateLabResult = async (req, res) => {
  try {
    const dto = new UpdateLabResultDTO(req.body, req.params);
    const labResult = await labResultService.updateLabResult(dto);
    res.status(200).json({ success: true, labResult });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// GET BY ID
// =============================
export const getLabResultById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const labResult = await labResultService.getById(id);

    if (!labResult) {
      return res
        .status(404)
        .json({ success: false, error: "Lab result not found" });
    }

    res.status(200).json({ success: true, labResult });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// LIST BY APPOINTMENT
// =============================
export const listLabResultsByAppointment = async (req, res) => {
  try {
    const appointmentId = Number(req.params.appointmentId);
    const labResults = await labResultService.listByAppointment(appointmentId);

    res.status(200).json({ success: true, labResults });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// LIST BY PATIENT
// =============================
export const listLabResultsByPatient = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);
    const labResults = await labResultService.listByPatient(patientId);

    res.status(200).json({ success: true, labResults });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
