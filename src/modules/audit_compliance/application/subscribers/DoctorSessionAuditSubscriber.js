import eventBus from "../../../../core/events/EventBus.js";
import AuditRepo from "../../infrastructure/repositories/AuditRepo.js";

const auditRepo = new AuditRepo();

// ============================================================
// SESSION CREATED
// ============================================================
eventBus.subscribe("DoctorSessionCreated", async (event) => {
  const { sessionId, actorId } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: "USER",
    action: "DOCTOR_SESSION_CREATED",
    tableAffected: "doctor_session",
    recordId: sessionId,
    details: "Doctor session created",
  });
});

// ============================================================
// SESSION UPDATED
// ============================================================
eventBus.subscribe("DoctorSessionUpdated", async (event) => {
  const { sessionId, actorId } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: "USER",
    action: "DOCTOR_SESSION_UPDATED",
    tableAffected: "doctor_session",
    recordId: sessionId,
    details: "Doctor session updated",
  });
});

// ============================================================
// SESSION DELETED
// ============================================================
eventBus.subscribe("DoctorSessionDeleted", async (event) => {
  const { sessionId, actorId } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: "USER",
    action: "DOCTOR_SESSION_DELETED",
    tableAffected: "doctor_session",
    recordId: sessionId,
    details: "Doctor session deleted",
  });
});
