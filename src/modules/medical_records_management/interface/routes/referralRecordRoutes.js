import express from "express";
import {
  createReferral,
  updateReferral,
  getReferralById,
  listReferralsByAppointment,
  listReferralsByPatient,
} from "../controllers/ReferralRecordController.js";

const router = express.Router();

router.post("/", createReferral);
router.put("/:id", updateReferral);
router.get("/:id", getReferralById);
router.get("/appointment/:appointmentId", listReferralsByAppointment);
router.get("/patient/:patientId", listReferralsByPatient);

export default router;
