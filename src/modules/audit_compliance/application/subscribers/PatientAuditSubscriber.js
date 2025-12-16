import eventBus from "../../../../core/events/EventBus.js";
import AuditRepo from "../../infrastructure/repositories/AuditRepo.js";

const auditRepo = new AuditRepo();

// ============================================================
// PATIENT REGISTERED
// ============================================================
eventBus.subscribe("PatientRegistered", async (event) => {
  const { patientId, actorId, actorRole } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: actorRole,
    action: "PATIENT_REGISTERED",
    tableAffected: "patients",
    recordId: patientId,
    details: "New patient registered",
  });
});

// ============================================================
// PATIENT UPDATED
// ============================================================
eventBus.subscribe("PatientUpdated", async (event) => {
  const { patientId, actorId } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: "USER",
    action: "PATIENT_UPDATED",
    tableAffected: "patients",
    recordId: patientId,
    details: "Patient information updated",
  });
});
