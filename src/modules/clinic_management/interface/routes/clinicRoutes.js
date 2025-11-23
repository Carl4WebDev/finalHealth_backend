import express from "express";
import {
  registerClinic,
  approveClinic,
  rejectClinic,
  getClinicById,
  getPendingClinics,
} from "../controllers/ClinicController.js";

const router = express.Router();

//working
router.post("/", registerClinic);
//working
router.post("/:id/approve", approveClinic);
//working
router.post("/:id/reject", rejectClinic);
//working
router.get("/clinics/:id", getClinicById);
//working
router.get("/clinics/pending/all", getPendingClinics);

export default router;
