import express from "express";
import {
  createLabResult,
  updateLabResult,
  getLabResultById,
  listLabResultsByAppointment,
  listLabResultsByPatient,
} from "../controllers/LabResultController.js";

const router = express.Router();

//working create lab result — returns the newly created lab_result row
router.post("/", createLabResult);

// update lab result — returns the updated lab_result row
router.put("/:id", updateLabResult);

//working get single lab result — returns one lab_result by ID or 404 if not found
router.get("/:id", getLabResultById);

//working list lab results for an appointment — returns all lab_result rows for that appointment
router.get("/appointment/:appointmentId", listLabResultsByAppointment);

//working list lab results for a patient — returns all lab_result rows for that patient
router.get("/patient/:patientId", listLabResultsByPatient);

export default router;
