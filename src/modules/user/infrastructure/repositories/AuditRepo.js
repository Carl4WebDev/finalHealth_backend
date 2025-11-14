import db from "../../../../core/database/db.js";
import IAuditRepository from "../../domain/repositories/IAuditRepository.js";

export default class AuditRepo extends IAuditRepository {
  async logAuth(userId, action, details) {
    await db.query(
      `INSERT INTO audit_user_log
        (user_id, action, details)
       VALUES ($1, $2, $3)`,
      [userId, action, details]
    );
  }
}
