import IMedicalRecordRepository from "../domain/repositories/IMedicalRecordRepository.js";
import MedicalRecord from "../domain/entities/MedicalRecord.js";
import db from "../../../core/database/db.js";

export default class MedicalRecordRepo extends IMedicalRecordRepository {
  async save(rec) {
    const query = `
      INSERT INTO medical_records
      (appointment_id, patient_id, record_date,
       diagnosis, treatment, medications, assessment,
       is_contagious, contagious_description,
       consultation_fee, medicine_fee, lab_fee, other_fee, total_amount)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *;
    `;

    const values = [
      rec.appointmentId,
      rec.patientId,
      rec.recordDate,
      rec.diagnosis,
      rec.treatment,
      rec.medications,
      rec.assessment,
      rec.isContagious,
      rec.contagiousDescription,
      rec.consultationFee,
      rec.medicineFee,
      rec.labFee,
      rec.otherFee,
      rec.totalAmount,
    ];

    const result = await db.query(query, values);
    return this._toEntity(result.rows[0]);
  }

  async update(id, updates) {
    const existing = await db.query(
      `SELECT * FROM medical_records WHERE record_id=$1`,
      [id]
    );
    if (!existing.rows.length) return null;
    const row = existing.rows[0];

    const query = `
      UPDATE medical_records
      SET 
        record_date=$1,
        diagnosis=$2,
        treatment=$3,
        medications=$4,
        assessment=$5,
        is_contagious=$6,
        contagious_description=$7,
        consultation_fee=$8,
        medicine_fee=$9,
        lab_fee=$10,
        other_fee=$11,
        total_amount=$12
      WHERE record_id=$13
      RETURNING *;
    `;

    const values = [
      updates.recordDate ?? row.record_date,
      updates.diagnosis ?? row.diagnosis,
      updates.treatment ?? row.treatment,
      updates.medications ?? row.medications,
      updates.assessment ?? row.assessment,

      updates.isContagious !== undefined
        ? updates.isContagious
        : row.is_contagious,

      updates.contagiousDescription ?? row.contagious_description,

      updates.consultationFee !== undefined
        ? Number(updates.consultationFee)
        : Number(row.consultation_fee),

      updates.medicineFee !== undefined
        ? Number(updates.medicineFee)
        : Number(row.medicine_fee),

      updates.labFee !== undefined
        ? Number(updates.labFee)
        : Number(row.lab_fee),

      updates.otherFee !== undefined
        ? Number(updates.otherFee)
        : Number(row.other_fee),

      updates.totalAmount !== undefined
        ? Number(updates.totalAmount)
        : Number(row.total_amount),

      id,
    ];

    const updated = await db.query(query, values);
    return this._toEntity(updated.rows[0]);
  }

  async findById(id) {
    const result = await db.query(
      `SELECT * FROM medical_records WHERE record_id=$1`,
      [id]
    );
    if (!result.rows.length) return null;
    return this._toEntity(result.rows[0]);
  }

  async findByAppointment(appointmentId) {
    const result = await db.query(
      `SELECT * FROM medical_records
       WHERE appointment_id=$1
       ORDER BY record_date DESC, created_at DESC`,
      [appointmentId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  async findByPatient(patientId) {
    const result = await db.query(
      `SELECT * FROM medical_records
       WHERE patient_id=$1
       ORDER BY record_date DESC, created_at DESC`,
      [patientId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  _toEntity(row) {
    return (
      new MedicalRecord.Builder()
        .setRecordId(row.record_id)
        .setAppointmentId(row.appointment_id)
        .setPatientId(row.patient_id)
        .setRecordDate(row.record_date)
        .setDiagnosis(row.diagnosis)
        .setTreatment(row.treatment)
        .setMedications(row.medications)
        .setAssessment(row.assessment)
        .setIsContagious(row.is_contagious)
        .setContagiousDescription(row.contagious_description)

        // Force-cast PostgreSQL NUMERIC (strings) into numbers
        .setConsultationFee(Number(row.consultation_fee))
        .setMedicineFee(Number(row.medicine_fee))
        .setLabFee(Number(row.lab_fee))
        .setOtherFee(Number(row.other_fee))
        .setTotalAmount(Number(row.total_amount))

        .setCreatedAt(row.created_at)
        .build()
    );
  }
}
