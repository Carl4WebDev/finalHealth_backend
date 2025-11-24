import IFollowupNoteRepository from "../domain/repositories/IFollowupNoteRepository.js";
import FollowupNote from "../domain/entities/FollowupNote.js";
import db from "../../../core/database/db.js";

export default class FollowupNoteRepo extends IFollowupNoteRepository {
  async save(f) {
    const query = `
      INSERT INTO followup_notes
      (appointment_id, patient_id, followup_date, notes, followup_img_path)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
    `;

    const values = [
      f.appointmentId,
      f.patientId,
      f.followupDate,
      f.notes,
      f.followupImgPath,
    ];

    const result = await db.query(query, values);
    return this._toEntity(result.rows[0]);
  }

  async update(id, updates) {
    const existing = await db.query(
      `SELECT * FROM followup_notes WHERE followup_id=$1`,
      [id]
    );
    if (!existing.rows.length) return null;
    const row = existing.rows[0];

    const query = `
      UPDATE followup_notes
      SET followup_date=$1,
          notes=$2,
          followup_img_path=$3
      WHERE followup_id=$4
      RETURNING *;
    `;

    const values = [
      updates.followupDate ?? row.followup_date,
      updates.notes ?? row.notes,
      updates.followupImgPath ?? row.followup_img_path,
      id,
    ];

    const updated = await db.query(query, values);
    return this._toEntity(updated.rows[0]);
  }

  async findById(id) {
    const result = await db.query(
      `SELECT * FROM followup_notes WHERE followup_id=$1`,
      [id]
    );
    if (!result.rows.length) return null;

    return this._toEntity(result.rows[0]);
  }

  async findByAppointment(appointmentId) {
    const result = await db.query(
      `SELECT * FROM followup_notes
       WHERE appointment_id=$1
       ORDER BY followup_date DESC, created_at DESC`,
      [appointmentId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  async findByPatient(patientId) {
    const result = await db.query(
      `SELECT * FROM followup_notes
       WHERE patient_id=$1
       ORDER BY followup_date DESC, created_at DESC`,
      [patientId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  _toEntity(row) {
    return new FollowupNote.Builder()
      .setFollowupId(row.followup_id)
      .setAppointmentId(row.appointment_id)
      .setPatientId(row.patient_id)
      .setFollowupDate(row.followup_date)
      .setNotes(row.notes)
      .setFollowupImgPath(row.followup_img_path)
      .setCreatedAt(row.created_at)
      .build();
  }
}
