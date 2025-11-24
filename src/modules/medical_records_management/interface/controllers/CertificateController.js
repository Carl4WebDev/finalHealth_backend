import CertificateRepo from "../../infrastructure/CertificateRepo.js";
import CertificateService from "../../application/services/CertificateService.js";

import CreateCertificateDTO from "../http/dtos/CreateCertificateDTO.js";
import UpdateCertificateDTO from "../http/dtos/UpdateCertificateDTO.js";

// Dependency Injection
const certRepo = new CertificateRepo();
const certService = new CertificateService(certRepo);

// =============================
// CREATE CERTIFICATE
// =============================
export const createCertificate = async (req, res) => {
  try {
    const dto = new CreateCertificateDTO(req.body);
    const certificate = await certService.createCertificate(dto);

    res.status(201).json({ success: true, certificate });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// UPDATE CERTIFICATE
// =============================
export const updateCertificate = async (req, res) => {
  try {
    const dto = new UpdateCertificateDTO(req.body, req.params);
    const certificate = await certService.updateCertificate(dto);

    res.status(200).json({ success: true, certificate });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// GET CERTIFICATE BY ID
// =============================
export const getCertificateById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const certificate = await certService.getById(id);

    if (!certificate) {
      return res
        .status(404)
        .json({ success: false, error: "Certificate not found" });
    }

    res.status(200).json({ success: true, certificate });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// LIST CERTIFICATES BY APPOINTMENT
// =============================
export const listCertificatesByAppointment = async (req, res) => {
  try {
    const appointmentId = Number(req.params.appointmentId);
    const certificates = await certService.listByAppointment(appointmentId);

    res.status(200).json({ success: true, certificates });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// =============================
// LIST CERTIFICATES BY PATIENT
// =============================
export const listCertificatesByPatient = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);
    const certificates = await certService.listByPatient(patientId);

    res.status(200).json({ success: true, certificates });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
