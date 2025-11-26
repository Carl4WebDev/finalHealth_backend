import db from "../../../../core/database/db.js";
import IAuditRepository from "../../domain/repositories/IAuditRepository.js";
import AuditLogEntry from "../../domain/entities/AuditLogEntry.js";

export default class AuditRepo extends IAuditRepository {
  // Backward compatibility (used by UserService & AdminService)
  async logAuth(actorId, actorType, action, details, recordID) {
    const tableAffected =
      actorType === "USER" ? "users" : actorType === "ADMIN" ? "admins" : null;

    const entry = new AuditLogEntry(
      actorId,
      actorType,
      action,
      details,
      tableAffected,
      recordID || null
    );

    return this.logAction(entry);
  }

  // New generic logger for all future subsystems
  async logAction(entry) {
    const query = `
      INSERT INTO audit_log_entry
        (actor_id, actor_type, action, table_affected, record_id, details)
      VALUES ($1,$2,$3,$4,$5,$6)
    `;

    const values = [
      entry.actorId,
      entry.actorType,
      entry.action,
      entry.tableAffected,
      entry.recordId,
      entry.details,
    ];

    await db.query(query, values);
  }

  async findByActor(actorId) {
    const res = await db.query(
      `SELECT * FROM audit_log_entry
       WHERE actor_id = $1
       ORDER BY timestamp DESC`,
      [actorId]
    );
    return res.rows;
  }

  async findAll() {
    const res = await db.query(
      `SELECT * FROM audit_log_entry
       ORDER BY timestamp DESC`
    );
    return res.rows;
  }
}
