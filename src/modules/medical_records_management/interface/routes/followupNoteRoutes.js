import express from "express";
import {
  createFollowup,
  updateFollowup,
  getFollowupById,
  listFollowupsByAppointment,
  listFollowupsByPatient,
} from "../controllers/FollowupNoteController.js";

const router = express.Router();

router.post("/", createFollowup);
router.put("/:id", updateFollowup);

// order: specific before generic
router.get("/appointment/:appointmentId", listFollowupsByAppointment);
router.get("/patient/:patientId", listFollowupsByPatient);
router.get("/:id", getFollowupById);

export default router;
