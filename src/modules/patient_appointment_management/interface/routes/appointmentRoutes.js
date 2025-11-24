import express from "express";
import {
  createAppointment,
  rescheduleAppointment,
  cancelAppointment,
  completeAppointment,
  listAppointmentsByDate,
  listAppointmentsByPatient,
  getAppointmentById,
} from "../controllers/AppointmentController.js";

const router = express.Router();

//working get single appointment — returns one appointment by ID or 404 if not found
router.get("/:id", getAppointmentById);

//working list by date range — returns all appointments for a clinic filtered by from/to dates
// clinicId=1&fromDate=2025-01-01&toDate=2025-12-31
router.get("/", listAppointmentsByDate);

//working create appointment — returns the newly created appointment object
router.post("/", createAppointment);

//working reschedule appointment — returns the updated appointment with new date/type/priority
router.put("/:id/reschedule", rescheduleAppointment);

//working cancel appointment — returns the cancelled appointment including the cancel reason
router.put("/:id/cancel", cancelAppointment);

//working complete appointment — returns the appointment with status updated to "Completed"
router.put("/:id/complete", completeAppointment);

//working list patient appointments — returns all appointments belonging to a specific patient
router.get("/patient/:patientId", listAppointmentsByPatient);

export default router;
