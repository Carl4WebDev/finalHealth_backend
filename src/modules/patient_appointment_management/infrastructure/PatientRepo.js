import IPatientRepository from "../domain/repositories/IPatientRepository.js";
import Patient from "../domain/entities/Patient.js";
import db from "../../../core/database/db.js";

export default class PatientRepo extends IPatientRepository {
  async createPatient(patient) {
    const client = await db.getClient();

    try {
      await client.query("BEGIN");

      const insertPatientQuery = `
      INSERT INTO patients
      (f_name, m_name, l_name, gender, date_of_birth,
       contact_number, backup_contact, email, address, priority_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING patient_id;
    `;

      const patientValues = [
        patient.fName,
        patient.mName,
        patient.lName,
        patient.gender,
        patient.dateOfBirth,
        patient.contactNumber,
        patient.backupContact,
        patient.email,
        patient.address,
        patient.priorityId,
      ];

      const patientResult = await client.query(
        insertPatientQuery,
        patientValues,
      );

      const patientId = patientResult.rows[0].patient_id;

      const linkQuery = `
      INSERT INTO doctor_patient_clinic
      (doctor_id, patient_id, clinic_id)
      VALUES ($1, $2, $3);
    `;

      await client.query(linkQuery, [
        patient.doctorId,
        patientId,
        patient.clinicId,
      ]);

      await client.query("COMMIT");

      return patientId;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async findById(id) {
    const result = await db.query(
      `SELECT * FROM patients WHERE patient_id=$1`,
      [id],
    );
    if (result.rows.length === 0) return null;
    return this._toEntity(result.rows[0]);
  }
  async getPatientOfDoctorInClinic(doctorId, clinicId) {
    const query = `
    SELECT
  p.patient_id,
  CONCAT(
    p.f_name, ' ',
    COALESCE(p.m_name || ' ', ''),
    p.l_name
  ) AS full_name,

  -- last visit is optional
  TO_CHAR(MAX(a.created_at), 'Mon DD, YYYY') AS last_visit,

  p.priority_id,
  pq.priority_level

FROM doctor_patient_clinic dpc

JOIN patients p
  ON p.patient_id = dpc.patient_id

LEFT JOIN appointments a
  ON a.patient_id = p.patient_id
  AND a.doctor_id = dpc.doctor_id
  AND a.clinic_id = dpc.clinic_id

LEFT JOIN priority_queue pq
  ON pq.priority_id = p.priority_id

WHERE dpc.doctor_id = $1
  AND dpc.clinic_id = $2

GROUP BY
  p.patient_id,
  p.f_name,
  p.m_name,
  p.l_name,
  p.priority_id,
  pq.priority_level

ORDER BY
  MAX(a.created_at) DESC NULLS LAST;

  `;

    const result = await db.query(query, [doctorId, clinicId]);
    return result.rows;
  }

  async findBySearch(term) {
    const like = `%${term}%`;
    const result = await db.query(
      `SELECT * FROM patients 
       WHERE LOWER(f_name || ' ' || l_name) LIKE LOWER($1)
          OR contact_number LIKE $1`,
      [like],
    );
    return result.rows.map((row) => this._toEntity(row));
  }

  async update(patient) {
    const query = `
      UPDATE patients
      SET f_name=$1, m_name=$2, l_name=$3, gender=$4,
          date_of_birth=$5, contact_number=$6, backup_contact=$7,
          email=$8, address=$9, patient_id=$10
      WHERE patient_id=$11
      RETURNING *;
    `;

    const values = [
      patient.fName,
      patient.mName,
      patient.lName,
      patient.gender,
      patient.dateOfBirth,
      patient.contactNumber,
      patient.backupContact,
      patient.email,
      patient.address,
      patient.patientTypeId,
      patient.patientId,
    ];

    const result = await db.query(query, values);
    return this._toEntity(result.rows[0]);
  }

  // Find patient by email or contact number (prevents duplicate entries)
  async findByEmail(email) {
    const query = `
      SELECT * FROM patients
      WHERE email = $1;
    `;
    const result = await db.query(query, [email]);
    return result.rows.length > 0 ? this._toEntity(result.rows[0]) : null;
  }
  _toEntity(row) {
    if (!row) return null;

    return new Patient.Builder()
      .setPatientId(row.patient_id)
      .setFName(row.f_name)
      .setMName(row.m_name)
      .setLName(row.l_name)
      .setGender(row.gender)
      .setDateOfBirth(row.date_of_birth)
      .setContactNumber(row.contact_number)
      .setBackupContact(row.backup_contact)
      .setEmail(row.email)
      .setAddress(row.address)
      .setPatientTypeId(row.patient_type_id)
      .setCreatedAt(row.created_at)
      .build();
  }

  // repositories/PatientRepo.js
  async updatePatient(patientId, payload, trx = db) {
    const keys = Object.keys(payload);

    if (keys.length === 0) return null;

    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const values = keys.map((key) => payload[key]);

    const query = `
    UPDATE patients
    SET ${setClause}
    WHERE patient_id = $${keys.length + 1}
    RETURNING *;
  `;

    const result = await trx.query(query, [...values, patientId]);

    return result.rows[0];
  }
}
