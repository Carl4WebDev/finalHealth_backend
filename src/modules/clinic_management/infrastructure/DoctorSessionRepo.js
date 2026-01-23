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

  async deleteSession(sessionId) {
    await db.query(`DELETE FROM doctor_sessions WHERE session_id=$1`, [
      sessionId,
    ]);
    return true;
  }

  async getAllDoctorSessions(doctorId) {
    const query = `
      SELECT
        ds.session_id,
        ds.doctor_id,
        ds.clinic_id,
        ds.day_of_week,

        TO_CHAR(ds.start_time, 'HH12:MI AM') AS start_time,
        TO_CHAR(ds.end_time, 'HH12:MI AM') AS end_time,

        ds.created_at,

        CASE
          WHEN ds.start_time < TIME '12:00' THEN 'Morning'
          WHEN ds.start_time < TIME '18:00' THEN 'Afternoon'
          ELSE 'Evening'
        END AS session_period,

        c.clinic_name,
        c.address,
        c.open_hours,
        c.open_days
      FROM doctor_sessions ds
      JOIN clinics c ON c.clinic_id = ds.clinic_id
      WHERE ds.doctor_id = $1
      ORDER BY
        CASE ds.day_of_week
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
        END,
        ds.start_time;
  `;

    const { rows } = await db.query(query, [doctorId]);
    return rows; // return raw rows, NOT _toEntity
  }

  async createDoctorSession(doctorId, clinicId, day, start, end) {
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

  async findById(id) {
    const result = await db.query(
      `SELECT * FROM doctor_sessions WHERE session_id=$1`,
      [id]
    );

    if (result.rows.length === 0) return null;

    return this._toEntity(result.rows[0]);
  }

  _toEntity(row) {
    if (!row) return null;

    return new DoctorSession.Builder()
      .setSessionId(row.session_id)
      .setDoctorId(row.doctor_id)
      .setClinicId(row.clinic_id)
      .setDayOfWeek(row.day_of_week)
      .setStartTime(row.start_time)
      .setEndTime(row.end_time)
      .build();
  }

  async getDoctorScheduleInClinic(doctorId, clinicId) {
    const query = `
    WITH next_7_days AS (
      SELECT CURRENT_DATE + i AS session_date
      FROM generate_series(0, 6) AS i
    )
    SELECT
      ds.session_id,
      ds.day_of_week,
      d.session_date,

      TO_CHAR(ds.start_time, 'HH12:MI AM') AS start_time,
      TO_CHAR(ds.end_time, 'HH12:MI AM')   AS end_time,

      CASE
        WHEN ds.start_time <= '12:00'
             AND ds.end_time >= '13:00'
          THEN 'Whole Day'
        WHEN ds.start_time < '12:00'
          THEN 'Morning'
        ELSE 'Afternoon'
      END AS session_period,

      COUNT(a.appointment_id) AS queue_count

    FROM next_7_days d
    JOIN doctor_sessions ds
      ON ds.day_of_week = TRIM(TO_CHAR(d.session_date, 'Day'))

    LEFT JOIN appointments a
      ON a.doctor_id = ds.doctor_id
      AND a.clinic_id = ds.clinic_id
      AND a.appointment_date = d.session_date
      AND a.status = 'Scheduled'

    WHERE ds.doctor_id = $1
      AND ds.clinic_id = $2

    GROUP BY
      ds.session_id,
      ds.day_of_week,
      d.session_date,
      ds.start_time,
      ds.end_time

    ORDER BY
      d.session_date,
      ds.start_time;
  `;

    const result = await db.query(query, [doctorId, clinicId]);
    return result.rows;
  }
}
