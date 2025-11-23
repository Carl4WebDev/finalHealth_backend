import ClinicRepo from "../../infrastructure/ClinicRepo.js";
import DoctorFactory from "../../domain/factories/DoctorFactory.js";
import ClinicManagementService from "../../application/services/ClinicManagementService.js";
import RegisterClinicDTO from "../http/dtos/RegisterClinicDTO.js";

const clinicRepo = new ClinicRepo();
const factory = new DoctorFactory();
const clinicService = new ClinicManagementService(clinicRepo, factory);

export const registerClinic = async (req, res) => {
  try {
    const dto = new RegisterClinicDTO(req.body);
    const clinic = await clinicService.registerClinic(dto);
    res.status(201).json({ success: true, clinic });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const approveClinic = async (req, res) => {
  try {
    await clinicService.approveClinic(Number(req.params.id));
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const rejectClinic = async (req, res) => {
  try {
    await clinicService.rejectClinic(Number(req.params.id), req.body.reason);
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
