import eventBus from "../../../../core/events/EventBus.js";
import AuditRepo from "../../infrastructure/repositories/AuditRepo.js";

const auditRepo = new AuditRepo();

// ============================================================
// DOCTOR REGISTERED
// ============================================================
eventBus.subscribe("DoctorRegistered", async (event) => {
  const { doctorId, actorId, actorRole } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: actorRole,
    action: "DOCTOR_REGISTERED",
    tableAffected: "doctor",
    recordId: doctorId,
    details: "Doctor registered",
  });
});

// ============================================================
// DOCTOR APPROVED
// ============================================================
eventBus.subscribe("DoctorApproved", async (event) => {
  const { doctorId, actorId } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: "ADMIN",
    action: "DOCTOR_APPROVED",
    tableAffected: "doctor",
    recordId: doctorId,
    details: "Doctor approved by admin",
  });
});

// ============================================================
// DOCTOR REJECTED
// ============================================================
eventBus.subscribe("DoctorRejected", async (event) => {
  const { doctorId, actorId, reason } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: "ADMIN",
    action: "DOCTOR_REJECTED",
    tableAffected: "doctor",
    recordId: doctorId,
    details: reason,
  });
});

// ============================================================
// DOCTOR ASSIGNED TO CLINIC
// ============================================================
eventBus.subscribe("DoctorAssignedToClinic", async (event) => {
  const { doctorId, clinicId, actorId } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: "ADMIN",
    action: "DOCTOR_ASSIGNED_TO_CLINIC",
    tableAffected: "clinic_doctor",
    recordId: doctorId,
    details: `Doctor ${doctorId} assigned to clinic ${clinicId}`,
  });
});
