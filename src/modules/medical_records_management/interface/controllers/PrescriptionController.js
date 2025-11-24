import PrescriptionRepo from "../../infrastructure/PrescriptionRepo.js";
import PrescriptionService from "../../application/services/PrescriptionService.js";

import CreatePrescriptionDTO from "../http/dtos/CreatePrescriptionDTO.js";
import UpdatePrescriptionDTO from "../http/dtos/UpdatePrescriptionDTO.js";

const prescriptionRepo = new PrescriptionRepo();
const prescriptionService = new PrescriptionService(prescriptionRepo);

export const createPrescription = async (req, res) => {
  try {
    const dto = new CreatePrescriptionDTO(req.body);
    const prescription = await prescriptionService.createPrescription(dto);
    res.status(201).json({ success: true, prescription });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const dto = new UpdatePrescriptionDTO(req.body, req.params);
    const prescription = await prescriptionService.updatePrescription(dto);
    res.status(200).json({ success: true, prescription });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getPrescriptionById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const prescription = await prescriptionService.getById(id);

    if (!prescription)
      return res
        .status(404)
        .json({ success: false, error: "Prescription not found" });

    res.status(200).json({ success: true, prescription });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const listPrescriptionsByAppointment = async (req, res) => {
  try {
    const appointmentId = Number(req.params.appointmentId);
    const prescriptions = await prescriptionService.listByAppointment(
      appointmentId
    );
    res.status(200).json({ success: true, prescriptions });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const listPrescriptionsByPatient = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);
    const prescriptions = await prescriptionService.listByPatient(patientId);
    res.status(200).json({ success: true, prescriptions });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
