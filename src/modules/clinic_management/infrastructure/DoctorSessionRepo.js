import IDoctorSessionRepository from "../domain/repositories/IDoctorSessionRepository.js";
import DoctorSession from "../domain/entities/DoctorSession.js";
import db from "../../../core/database/db.js";

export default class DoctorSessionRepo extends IDoctorSessionRepository {
  async save(session) {
    const query = `
      INSERT INTO doctor_sessions 
      (doctor_id, clinic_id, day_of_week, start_time, end_time)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
    `;

    const result = await db.query(query, [
      session.doctorId,
      session.clinicId,
      session.dayOfWeek,
      session.startTime,
      session.endTime,
    ]);

    return this._toEntity(result.rows[0]);
  }

  async update(session) {
    const query = `
    UPDATE doctor_sessions
    SET 
      day_of_week=$1, 
      start_time=$2, 
      end_time=$3,
      doctor_id=$4,
      clinic_id=$5
    WHERE session_id=$6
    RETURNING *;
  `;

    const result = await db.query(query, [
      session.dayOfWeek,
      session.startTime,
      session.endTime,
      session.doctorId,
      session.clinicId,
      session.sessionId,
    ]);

    return this._toEntity(result.rows[0]);
  }

  async delete(id) {
    await db.query(`DELETE FROM doctor_sessions WHERE session_id=$1`, [id]);
    return true;
  }

  async findByDoctor(doctorId) {
    const result = await db.query(
      `SELECT * FROM doctor_sessions WHERE doctor_id=$1`,
      [doctorId]
    );

    return result.rows.map((row) => this._toEntity(row));
  }

  async findConflicts(doctorId, clinicId, day, start, end) {
    const query = `
    SELECT * FROM doctor_sessions
    WHERE doctor_id = $1
    AND clinic_id = $2
    AND day_of_week = $3
    AND (
      start_time < $5  -- existing starts before new ends
      AND end_time > $4 -- existing ends after new starts
      AND (
      (start_time < $5 AND end_time > $4)
      OR (start_time = $4 AND end_time = $5)
    )

    );
  `;

    const result = await db.query(query, [doctorId, clinicId, day, start, end]);

    return result.rows.map((row) => this._toEntity(row));
  }

  _toEntity(row) {
    return new DoctorSession.Builder()
      .setSessionId(row.session_id)
      .setDoctorId(row.doctor_id)
      .setClinicId(row.clinic_id)
      .setDayOfWeek(row.day_of_week)
      .setStartTime(row.start_time)
      .setEndTime(row.end_time)
      .setCreatedAt(row.created_at)
      .build();
  }
}
