export default class AuditLogEntry {
  constructor(
    actorId,
    actorType,
    action,
    details,
    tableAffected = null,
    recordId = null
  ) {
    this.actorId = actorId; // user_id or admin_id
    this.actorType = actorType; // 'USER' or 'ADMIN'
    this.action = action; // LOGIN_SUCCESS, FAILED_LOGIN, LOGOUT
    this.tableAffected = tableAffected; // optional
    this.recordId = recordId; // optional
    this.timestamp = new Date(); // auto timestamp
    this.details = details; // description
  }
}
