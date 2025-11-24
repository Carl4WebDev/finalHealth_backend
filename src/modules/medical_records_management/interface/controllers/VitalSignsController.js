import VitalSignsRepo from "../../infrastructure/VitalSignsRepo.js";
import VitalSignsService from "../../application/services/VitalSignsService.js";

import CreateVitalSignsDTO from "../http/dtos/CreateVitalSignsDTO.js";
import UpdateVitalSignsDTO from "../http/dtos/UpdateVitalSignsDTO.js";

const vitalRepo = new VitalSignsRepo();
const vitalService = new VitalSignsService(vitalRepo);

export const createVital = async (req, res) => {
  try {
    const dto = new CreateVitalSignsDTO(req.body);
    const vital = await vitalService.createVital(dto);
    res.status(201).json({ success: true, vital });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateVital = async (req, res) => {
  try {
    const dto = new UpdateVitalSignsDTO(req.body, req.params);
    const vital = await vitalService.updateVital(dto);
    res.status(200).json({ success: true, vital });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getVitalById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const vital = await vitalService.getById(id);

    if (!vital)
      return res
        .status(404)
        .json({ success: false, error: "Vital signs record not found" });

    res.status(200).json({ success: true, vital });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const listVitalsByAppointment = async (req, res) => {
  try {
    const appointmentId = Number(req.params.appointmentId);
    const vitals = await vitalService.listByAppointment(appointmentId);
    res.status(200).json({ success: true, vitals });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const listVitalsByPatient = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);
    const vitals = await vitalService.listByPatient(patientId);
    res.status(200).json({ success: true, vitals });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
