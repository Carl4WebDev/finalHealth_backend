import express from "express";
import {
  createVital,
  updateVital,
  getVitalById,
  listVitalsByAppointment,
  listVitalsByPatient,
} from "../controllers/VitalSignsController.js";

const router = express.Router();

//working
router.post("/", createVital);
//working
router.put("/:id", updateVital);
//working
router.get("/:id", getVitalById);
//working
router.get("/appointment/:appointmentId", listVitalsByAppointment);
//working
router.get("/patient/:patientId", listVitalsByPatient);

export default router;
