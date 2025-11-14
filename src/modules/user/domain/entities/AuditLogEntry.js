export default class AuditLogEntry {
  constructor(userId, action, details) {
    this.userId = userId;
    this.action = action;
    this.details = details;
  }
}
