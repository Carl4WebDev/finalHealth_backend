import IPriorityRepository from "../../domain/repositories/IPriorityRepository.js";
import Priority from "../../domain/entities/Priority.js";
import db from "../../../core/database/db.js";

export default class PriorityRepo extends IPriorityRepository {
  /* ============================
        FIND ALL PRIORITIES
  ============================ */
  async findAll() {
    const result = await db.query(
      `SELECT * FROM priority_queue ORDER BY priority_rank ASC`
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  /* ============================
        FIND BY ID
  ============================ */
  async findById(id) {
    const result = await db.query(
      `SELECT * FROM priority_queue WHERE priority_id=$1`,
      [id]
    );

    if (result.rows.length === 0) return null;
    return this._toEntity(result.rows[0]);
  }

  /* ============================
        PRIVATE MAPPER: DB → ENTITY
  ============================ */
  _toEntity(row) {
    if (!row) return null;

    return new Priority.Builder()
      .setPriorityId(row.priority_id)
      .setPriorityLevel(row.priority_level) // FIXED: correct column
      .setDescription(row.description)
      .setPriorityRank(row.priority_rank)
      .build();
  }
}
