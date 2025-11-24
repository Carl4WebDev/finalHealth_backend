import express from "express";
import {
  createCertificate,
  updateCertificate,
  getCertificateById,
  listCertificatesByAppointment,
  listCertificatesByPatient,
} from "../controllers/CertificateController.js";

const router = express.Router();

//working CREATE certificate
router.post("/", createCertificate);

//working UPDATE certificate
router.put("/:id", updateCertificate);

//working GET one
router.get("/:id", getCertificateById);

//working LIST BY APPOINTMENT
router.get("/appointment/:appointmentId", listCertificatesByAppointment);

//working LIST BY PATIENT
router.get("/patient/:patientId", listCertificatesByPatient);

export default router;
