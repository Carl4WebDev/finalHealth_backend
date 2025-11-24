import IVitalSignsRepository from "../domain/repositories/IVitalSignsRepository.js";
import VitalSigns from "../domain/entities/VitalSigns.js";
import db from "../../../core/database/db.js";

export default class VitalSignsRepo extends IVitalSignsRepository {
  async save(vital) {
    const query = `
      INSERT INTO vital_signs
      (appointment_id, patient_id, blood_pressure, heart_rate, temperature,
       oxygen_saturation, weight, vital_img_path)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `;

    const values = [
      vital.appointmentId,
      vital.patientId,
      vital.bloodPressure,
      vital.heartRate,
      vital.temperature,
      vital.oxygenSaturation,
      vital.weight,
      vital.vitalImgPath,
    ];

    const result = await db.query(query, values);
    return this._toEntity(result.rows[0]);
  }

  async update(id, updates) {
    const existing = await db.query(
      `SELECT * FROM vital_signs WHERE vital_id=$1`,
      [id]
    );
    if (!existing.rows.length) return null;
    const row = existing.rows[0];

    const query = `
      UPDATE vital_signs
      SET blood_pressure=$1,
          heart_rate=$2,
          temperature=$3,
          oxygen_saturation=$4,
          weight=$5,
          vital_img_path=$6
      WHERE vital_id=$7
      RETURNING *;
    `;

    const values = [
      updates.bloodPressure ?? row.blood_pressure,
      updates.heartRate ?? row.heart_rate,
      updates.temperature ?? row.temperature,
      updates.oxygenSaturation ?? row.oxygen_saturation,
      updates.weight ?? row.weight,
      updates.vitalImgPath ?? row.vital_img_path,
      id,
    ];

    const updated = await db.query(query, values);
    return this._toEntity(updated.rows[0]);
  }

  async findById(id) {
    const result = await db.query(
      `SELECT * FROM vital_signs WHERE vital_id=$1`,
      [id]
    );
    if (!result.rows.length) return null;

    return this._toEntity(result.rows[0]);
  }

  async findByAppointment(appointmentId) {
    const result = await db.query(
      `SELECT * FROM vital_signs
       WHERE appointment_id=$1
       ORDER BY created_at DESC`,
      [appointmentId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  async findByPatient(patientId) {
    const result = await db.query(
      `SELECT * FROM vital_signs
       WHERE patient_id=$1
       ORDER BY created_at DESC`,
      [patientId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  _toEntity(row) {
    return new VitalSigns.Builder()
      .setVitalId(row.vital_id)
      .setAppointmentId(row.appointment_id)
      .setPatientId(row.patient_id)
      .setBloodPressure(row.blood_pressure)
      .setHeartRate(row.heart_rate)
      .setTemperature(row.temperature)
      .setOxygenSaturation(row.oxygen_saturation)
      .setWeight(row.weight)
      .setVitalImgPath(row.vital_img_path)
      .setCreatedAt(row.created_at)
      .build();
  }
}
