import express from "express";
import {
  createMedicalRecord,
  updateMedicalRecord,
  getMedicalRecordById,
  listMedicalRecordsByAppointment,
  listMedicalRecordsByPatient,
} from "../controllers/MedicalRecordController.js";

const router = express.Router();

router.post("/", createMedicalRecord);
router.put("/:id", updateMedicalRecord);

// specific first, generic last
router.get("/appointment/:appointmentId", listMedicalRecordsByAppointment);
router.get("/patient/:patientId", listMedicalRecordsByPatient);
router.get("/:id", getMedicalRecordById);

export default router;
