import IReferralRecordRepository from "../domain/repositories/IReferralRecordRepository.js";
import ReferralRecord from "../domain/entities/ReferralRecord.js";
import db from "../../../core/database/db.js";

export default class ReferralRecordRepo extends IReferralRecordRepository {
  async save(ref) {
    const query = `
      INSERT INTO referral_records
      (appointment_id, patient_id, referred_to, reason, notes, referral_img_path)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *;
    `;

    const values = [
      ref.appointmentId,
      ref.patientId,
      ref.referredTo,
      ref.reason,
      ref.notes,
      ref.referralImgPath,
    ];

    const result = await db.query(query, values);
    return this._toEntity(result.rows[0]);
  }

  async update(id, updates) {
    const existing = await db.query(
      `SELECT * FROM referral_records WHERE referral_id=$1`,
      [id]
    );

    if (!existing.rows.length) return null;
    const row = existing.rows[0];

    const query = `
      UPDATE referral_records
      SET referred_to=$1,
          reason=$2,
          notes=$3,
          referral_img_path=$4
      WHERE referral_id=$5
      RETURNING *;
    `;

    const values = [
      updates.referredTo ?? row.referred_to,
      updates.reason ?? row.reason,
      updates.notes ?? row.notes,
      updates.referralImgPath ?? row.referral_img_path,
      id,
    ];

    const updated = await db.query(query, values);
    return this._toEntity(updated.rows[0]);
  }

  async findById(id) {
    const result = await db.query(
      `SELECT * FROM referral_records WHERE referral_id=$1`,
      [id]
    );
    if (!result.rows.length) return null;

    return this._toEntity(result.rows[0]);
  }

  async findByAppointment(appointmentId) {
    const result = await db.query(
      `SELECT * FROM referral_records
       WHERE appointment_id=$1
       ORDER BY created_at DESC`,
      [appointmentId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  async findByPatient(patientId) {
    const result = await db.query(
      `SELECT * FROM referral_records
       WHERE patient_id=$1
       ORDER BY created_at DESC`,
      [patientId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  _toEntity(row) {
    return new ReferralRecord.Builder()
      .setReferralId(row.referral_id)
      .setAppointmentId(row.appointment_id)
      .setPatientId(row.patient_id)
      .setReferredTo(row.referred_to)
      .setReason(row.reason)
      .setNotes(row.notes)
      .setReferralImgPath(row.referral_img_path)
      .setCreatedAt(row.created_at)
      .build();
  }
}
