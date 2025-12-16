import eventBus from "../../../../core/events/EventBus.js";
import AuditRepo from "../../infrastructure/repositories/AuditRepo.js";

const auditRepo = new AuditRepo();

eventBus.subscribe("ClinicRegistered", async (event) => {
  const { clinicId, actorId, actorRole } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: actorRole,
    action: "CLINIC_REGISTERED",
    tableAffected: "clinic",
    recordId: clinicId,
    details: "Clinic registered",
  });
});

eventBus.subscribe("ClinicApproved", async (event) => {
  const { clinicId, actorId } = event.payload;

  await auditRepo.logAction({
    actorId: actorId,
    actorType: "ADMIN",
    action: "CLINIC_APPROVED",
    tableAffected: "clinic",
    recordId: clinicId,
    details: "Clinic approved by admin",
  });
});

eventBus.subscribe("ClinicRejected", async (event) => {
  const { clinicId, adminId, reason } = event.payload;

  await auditRepo.logAction({
    actorId: adminId,
    actorType: "ADMIN",
    action: "CLINIC_REJECTED",
    tableAffected: "clinic",
    recordId: clinicId,
    details: reason,
  });
});
