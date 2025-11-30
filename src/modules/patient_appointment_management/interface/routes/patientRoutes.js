import express from "express";
import {
  registerPatient,
  getPatientById,
  searchPatients,
  getAllPatients,
} from "../controllers/PatientController.js";
import authMiddleware from "../../../../core/middleware/Auth.js"; // Correct path to the middleware

const router = express.Router();

// working — Registers a new patient and returns the created patient entity
router.post("/", authMiddleware, registerPatient);

router.get("/all-patient", authMiddleware, getAllPatients);

// working — Retrieves a single patient by ID (returns the patient or 404 if not found)
router.get("/:id", getPatientById);

// working — Searches patients by name, email, or contact number (returns a list)
router.get("/", searchPatients);

export default router;
