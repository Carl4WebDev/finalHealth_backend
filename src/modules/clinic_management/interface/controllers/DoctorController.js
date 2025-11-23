import DoctorRepo from "../../infrastructure/DoctorRepo.js";
import ClinicRepo from "../../infrastructure/ClinicRepo.js";
import DoctorFactory from "../../domain/factories/DoctorFactory.js";

import DoctorManagementService from "../../application/services/DoctorManagementService.js";

import RegisterDoctorDTO from "../http/dtos/RegisterDoctorDTO.js";

const doctorRepo = new DoctorRepo();
const clinicRepo = new ClinicRepo();
const factory = new DoctorFactory();

const doctorService = new DoctorManagementService(
  doctorRepo,
  clinicRepo,
  factory
);

export const registerDoctor = async (req, res) => {
  try {
    const dto = new RegisterDoctorDTO(req.body);
    const doctor = await doctorService.registerDoctor(dto);
    res.status(201).json({ success: true, doctor });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const approveDoctor = async (req, res) => {
  try {
    const doctorId = Number(req.params.id);
    await doctorService.approveDoctor(doctorId);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const rejectDoctor = async (req, res) => {
  try {
    const doctorId = Number(req.params.id);
    const { reason } = req.body;
    await doctorService.rejectDoctor(doctorId, reason);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const assignDoctorToClinic = async (req, res) => {
  try {
    const doctorId = Number(req.params.id);
    const clinicId = Number(req.body.clinicId);
    await doctorService.assignDoctorToClinic(doctorId, clinicId);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
