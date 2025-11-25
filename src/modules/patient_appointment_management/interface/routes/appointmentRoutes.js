import express from "express";
import {
  createAppointment,
  rescheduleAppointment,
  cancelAppointment,
  completeAppointment,
  listAppointmentsByDate,
  listAppointmentsByPatient,
  getAppointmentById,
  listAllAppointmentsForDoctor,
  listTodayAppointments,
} from "../controllers/AppointmentController.js";

// Importing authMiddleware
import authMiddleware from "../../../../core/middleware/Auth.js"; // Correct path to the middleware

const router = express.Router();

// Public routes
router.get("/doctor/:doctorId/clinic/:clinicId/today", listTodayAppointments); // No authentication needed for this one
router.get("/:id", getAppointmentById); // Public route, doesn't need auth
router.get("/", listAppointmentsByDate); // Public route, doesn't need auth

// Protected routes (authentication required)
router.post("/", authMiddleware, createAppointment); // Create new appointment (requires auth)
router.put("/:id/reschedule", authMiddleware, rescheduleAppointment); // Reschedule appointment (requires auth)
router.put("/:id/cancel", authMiddleware, cancelAppointment); // Cancel appointment (requires auth)
router.put("/:id/complete", authMiddleware, completeAppointment); // Complete appointment (requires auth)

// List appointments by patient — returns all appointments belonging to a specific patient (protected)
router.get("/patient/:patientId", authMiddleware, listAppointmentsByPatient);

// Fetch ALL appointments for a doctor IN a specific clinic (protected)
router.get(
  "/doctor/:doctorId/clinic/:clinicId",
  authMiddleware,
  listAllAppointmentsForDoctor
);

export default router;
