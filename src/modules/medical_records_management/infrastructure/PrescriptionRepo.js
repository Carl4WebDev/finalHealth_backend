import IPrescriptionRepository from "../domain/repositories/IPrescriptionRepository.js";
import Prescription from "../domain/entities/Prescription.js";
import db from "../../../core/database/db.js";

export default class PrescriptionRepo extends IPrescriptionRepository {
  async save(p) {
    const query = `
      INSERT INTO prescription
      (appointment_id, patient_id, prescribed_date, medication_name, dosage,
       frequency, duration, instructions, prescription_img_path)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *;
    `;

    const values = [
      p.appointmentId,
      p.patientId,
      p.prescribedDate,
      p.medicationName,
      p.dosage,
      p.frequency,
      p.duration,
      p.instructions,
      p.prescriptionImgPath,
    ];

    const result = await db.query(query, values);
    return this._toEntity(result.rows[0]);
  }

  async update(id, updates) {
    const existing = await db.query(
      `SELECT * FROM prescription WHERE prescription_id=$1`,
      [id]
    );

    if (!existing.rows.length) return null;
    const row = existing.rows[0];

    const query = `
      UPDATE prescription
      SET prescribed_date=$1,
          medication_name=$2,
          dosage=$3,
          frequency=$4,
          duration=$5,
          instructions=$6,
          prescription_img_path=$7
      WHERE prescription_id=$8
      RETURNING *;
    `;

    const values = [
      updates.prescribedDate ?? row.prescribed_date,
      updates.medicationName ?? row.medication_name,
      updates.dosage ?? row.dosage,
      updates.frequency ?? row.frequency,
      updates.duration ?? row.duration,
      updates.instructions ?? row.instructions,
      updates.prescriptionImgPath ?? row.prescription_img_path,
      id,
    ];

    const updated = await db.query(query, values);
    return this._toEntity(updated.rows[0]);
  }

  async findById(id) {
    const result = await db.query(
      `SELECT * FROM prescription WHERE prescription_id=$1`,
      [id]
    );

    if (!result.rows.length) return null;
    return this._toEntity(result.rows[0]);
  }

  async findByAppointment(appId) {
    const result = await db.query(
      `SELECT * FROM prescription
       WHERE appointment_id=$1
       ORDER BY prescribed_date DESC, created_at DESC`,
      [appId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  async findByPatient(patientId) {
    const result = await db.query(
      `SELECT * FROM prescription
       WHERE patient_id=$1
       ORDER BY prescribed_date DESC, created_at DESC`,
      [patientId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  _toEntity(row) {
    return new Prescription.Builder()
      .setPrescriptionId(row.prescription_id)
      .setAppointmentId(row.appointment_id)
      .setPatientId(row.patient_id)
      .setPrescribedDate(row.prescribed_date)
      .setMedicationName(row.medication_name)
      .setDosage(row.dosage)
      .setFrequency(row.frequency)
      .setDuration(row.duration)
      .setInstructions(row.instructions)
      .setPrescriptionImgPath(row.prescription_img_path)
      .setCreatedAt(row.created_at)
      .build();
  }
}
