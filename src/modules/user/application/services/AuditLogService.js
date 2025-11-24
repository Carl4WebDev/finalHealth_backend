import AuditLogEntry from "../../domain/entities/AuditLogEntry.js";

export default class AuditLogService {
  constructor(auditRepo) {
    this.auditRepo = auditRepo;
  }

  async record({
    actorId,
    actorType,
    action,
    tableAffected,
    recordId,
    details,
  }) {
    const entry = new AuditLogEntry(
      actorId,
      actorType,
      action,
      details,
      tableAffected,
      recordId
    );

    return this.auditRepo.logAction(entry);
  }

  async getMyLogs(actorId) {
    return this.auditRepo.findByActor(actorId);
  }

  async getAllLogs() {
    return this.auditRepo.findAll();
  }
}
