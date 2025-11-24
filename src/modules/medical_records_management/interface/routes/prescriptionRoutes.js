import express from "express";
import {
  createPrescription,
  updatePrescription,
  getPrescriptionById,
  listPrescriptionsByAppointment,
  listPrescriptionsByPatient,
} from "../controllers/PrescriptionController.js";

const router = express.Router();

router.post("/", createPrescription);
router.put("/:id", updatePrescription);
router.get("/:id", getPrescriptionById);
router.get("/appointment/:appointmentId", listPrescriptionsByAppointment);
router.get("/patient/:patientId", listPrescriptionsByPatient);

export default router;
