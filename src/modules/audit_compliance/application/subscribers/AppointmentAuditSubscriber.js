import eventBus from "../../../../core/events/EventBus.js";
import AuditRepo from "../../infrastructure/repositories/AuditRepo.js";

const auditRepo = new AuditRepo();

// ============================================================
// APPOINTMENT CREATED
// ============================================================
eventBus.subscribe("AppointmentCreated", async (event) => {
  const { appointmentId, actorId, actorRole } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: actorRole,
    action: "APPOINTMENT_CREATED",
    tableAffected: "appointments",
    recordId: appointmentId,
    details: "Appointment created",
  });
});

// ============================================================
// APPOINTMENT RESCHEDULED
// ============================================================
eventBus.subscribe("AppointmentRescheduled", async (event) => {
  const { appointmentId, actorId } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: "USER",
    action: "APPOINTMENT_RESCHEDULED",
    tableAffected: "appointments",
    recordId: appointmentId,
    details: "Appointment rescheduled",
  });
});

// ============================================================
// APPOINTMENT CANCELLED
// ============================================================
eventBus.subscribe("AppointmentCancelled", async (event) => {
  const { appointmentId, actorId } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: "USER",
    action: "APPOINTMENT_CANCELLED",
    tableAffected: "appointments",
    recordId: appointmentId,
    details: "Appointment cancelled",
  });
});

// ============================================================
// APPOINTMENT COMPLETED
// ============================================================
eventBus.subscribe("AppointmentCompleted", async (event) => {
  const { appointmentId, actorId } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: "USER",
    action: "APPOINTMENT_COMPLETED",
    tableAffected: "appointments",
    recordId: appointmentId,
    details: "Appointment marked as completed",
  });
});
