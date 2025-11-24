import ILabResultRepository from "../domain/repositories/ILabResultRepository.js";
import LabResult from "../domain/entities/LabResult.js";
import db from "../../../core/database/db.js";

export default class LabResultRepo extends ILabResultRepository {
  async save(labResult) {
    const query = `
      INSERT INTO lab_result
      (appointment_id, patient_id, test_date, test_type, result, interpretation, lab_img_path)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *;
    `;

    const values = [
      labResult.appointmentId,
      labResult.patientId,
      labResult.testDate,
      labResult.testType,
      labResult.result,
      labResult.interpretation,
      labResult.labImgPath,
    ];

    const result = await db.query(query, values);
    return this._toEntity(result.rows[0]);
  }

  async update(id, updates) {
    // Get the existing row first
    const existing = await db.query(
      `SELECT * FROM lab_result WHERE result_id=$1`,
      [id]
    );

    if (existing.rows.length === 0) return null;
    const row = existing.rows[0];

    // Only overwrite fields that are provided
    const testType = updates.testType ?? row.test_type;
    const result = updates.result ?? row.result;
    const interpretation = updates.interpretation ?? row.interpretation;
    const labImgPath = updates.labImgPath ?? row.lab_img_path;

    const query = `
    UPDATE lab_result
    SET 
      test_type=$1,
      result=$2,
      interpretation=$3,
      lab_img_path=$4
    WHERE result_id=$5
    RETURNING *;
  `;

    const values = [testType, result, interpretation, labImgPath, id];

    const updated = await db.query(query, values);
    return this._toEntity(updated.rows[0]);
  }

  async findById(id) {
    const result = await db.query(
      `SELECT * FROM lab_result WHERE result_id=$1`,
      [id]
    );
    if (result.rows.length === 0) return null;
    return this._toEntity(result.rows[0]);
  }

  async findByAppointment(appointmentId) {
    const result = await db.query(
      `SELECT * FROM lab_result
       WHERE appointment_id=$1
       ORDER BY test_date DESC, created_at DESC`,
      [appointmentId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  async findByPatient(patientId) {
    const result = await db.query(
      `SELECT * FROM lab_result
       WHERE patient_id=$1
       ORDER BY test_date DESC, created_at DESC`,
      [patientId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  _toEntity(row) {
    if (!row) return null;

    return new LabResult.Builder()
      .setResultId(row.result_id)
      .setAppointmentId(row.appointment_id)
      .setPatientId(row.patient_id)
      .setTestDate(row.test_date)
      .setTestType(row.test_type)
      .setResult(row.result)
      .setInterpretation(row.interpretation)
      .setLabImgPath(row.lab_img_path)
      .setCreatedAt(row.created_at)
      .build();
  }
}
