import express from "express";
import {
  createAppointment,
  rescheduleAppointment,
  cancelAppointment,
  completeAppointment,
  listAppointmentsByDate,
  listAppointmentsByPatient,
} from "../controllers/AppointmentController.js";

const router = express.Router();

// create appointment
router.post("/", createAppointment);

// reschedule appointment
router.put("/:id/reschedule", rescheduleAppointment);

// cancel appointment
router.put("/:id/cancel", cancelAppointment);

// complete appointment
router.put("/:id/complete", completeAppointment);

// list by date range
router.get("/", listAppointmentsByDate);

// list patient appointments
router.get("/patient/:patientId", listAppointmentsByPatient);

export default router;
