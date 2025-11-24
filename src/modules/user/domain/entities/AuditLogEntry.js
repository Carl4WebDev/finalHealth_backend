export default class AuditLogEntry {
  constructor(
    actorId,
    actorType,
    action,
    details,
    tableAffected = null,
    recordId = null,
    timestamp = new Date()
  ) {
    this.actorId = actorId; // user_id or admin_id
    this.actorType = actorType; // 'USER', 'ADMIN', 'DOCTOR', 'SECRETARY'
    this.action = action; // e.g. LOGIN_SUCCESS, CLINIC_VERIFIED
    this.tableAffected = tableAffected; // e.g. 'users', 'clinics', 'appointments'
    this.recordId = recordId; // affected record id
    this.timestamp = timestamp; // JS timestamp; DB will also have its own
    this.details = details; // description or JSON string
  }
}
