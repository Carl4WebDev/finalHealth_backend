import db from "../../../../core/database/db.js";
import IAuditRepository from "../../domain/repositories/IAuditRepository.js";

export default class AuditRepo extends IAuditRepository {
  async logAuth(actorId, actorType, action, details) {
    await db.query(
      `INSERT INTO audit_log_entry 
         (actor_id, actor_type, action, details)
       VALUES ($1, $2, $3, $4)`,
      [actorId, actorType, action, details]
    );
  }
}
