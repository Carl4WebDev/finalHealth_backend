import express from "express";

import db from "../../../../core/database/db.js";

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

// Route to update the appointment status
router.put("/:appointmentId/status", async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  try {
    if (!status || !appointmentId) {
      return res
        .status(400)
        .json({ message: "Missing status or appointment ID." });
    }

    // Update appointment status in the appointments table
    const query = `
      UPDATE appointments
      SET status = $1
      WHERE appointment_id = $2
      RETURNING *;
    `;
    const values = [status, appointmentId];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({
      message: "Appointment status updated successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res
      .status(500)
      .json({ message: "Server error while updating appointment status." });
  }
});

export default router;
