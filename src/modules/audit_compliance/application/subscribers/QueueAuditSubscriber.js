import eventBus from "../../../../core/events/EventBus.js";
import AuditRepo from "../../infrastructure/repositories/AuditRepo.js";

const auditRepo = new AuditRepo();

// ============================================================
// QUEUE ADDED
// ============================================================
eventBus.subscribe("QueueAdded", async (event) => {
  const { queueEntryId, actorId, actorRole } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: actorRole,
    action: "QUEUE_ADDED",
    tableAffected: "queue_entries",
    recordId: queueEntryId,
    details: "Patient added to queue",
  });
});

// ============================================================
// QUEUE STATUS UPDATED
// ============================================================
eventBus.subscribe("QueueStatusUpdated", async (event) => {
  const { queueEntryId, status, actorId } = event.payload;

  await auditRepo.logAction({
    actorId,
    actorType: "USER",
    action: `QUEUE_${status.toUpperCase()}`,
    tableAffected: "queue_entries",
    recordId: queueEntryId,
    details: `Queue status updated to ${status}`,
  });
});
