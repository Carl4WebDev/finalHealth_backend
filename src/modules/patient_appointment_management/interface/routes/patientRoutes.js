import express from "express";
import {
  registerPatient,
  updatePatient,
  getPatientById,
  searchPatients,
  getAllPatients,
} from "../controllers/PatientController.js";

import authMiddleware from "../../../../core/middleware/Auth.js";
import { requireUser } from "../../../../core/middleware/requireUser.js";

const router = express.Router();

// WRITE
router.post("/", authMiddleware, requireUser, registerPatient);
router.put("/patient/:id", authMiddleware, requireUser, updatePatient);

// READ
router.get("/", authMiddleware, searchPatients);
router.get("/all", authMiddleware, getAllPatients);
router.get("/patient/:id", authMiddleware, getPatientById);

export default router;
