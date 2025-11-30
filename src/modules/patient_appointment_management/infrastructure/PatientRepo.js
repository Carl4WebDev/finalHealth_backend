import IPatientRepository from "../domain/repositories/IPatientRepository.js";
import Patient from "../domain/entities/Patient.js";
import db from "../../../core/database/db.js";

export default class PatientRepo extends IPatientRepository {
  async save(patient) {
    const query = `
      INSERT INTO patients
      (f_name, m_name, l_name, gender, date_of_birth,
       contact_number, backup_contact, email, address, patient_type_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
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
    ];

    const result = await db.query(query, values);
    return this._toEntity(result.rows[0]);
  }

  async findById(id) {
    const result = await db.query(
      `SELECT * FROM patients WHERE patient_id=$1`,
      [id]
    );
    if (result.rows.length === 0) return null;
    return this._toEntity(result.rows[0]);
  }
  async getAll() {
    const result = await db.query("SELECT * FROM patients"); // Fetch all patients from the database
    return result.rows; // Return the fetched rows
  }

  async findBySearch(term) {
    const like = `%${term}%`;
    const result = await db.query(
      `SELECT * FROM patients 
       WHERE LOWER(f_name || ' ' || l_name) LIKE LOWER($1)
          OR contact_number LIKE $1`,
      [like]
    );
    return result.rows.map((row) => this._toEntity(row));
  }

  async update(patient) {
    const query = `
      UPDATE patients
      SET f_name=$1, m_name=$2, l_name=$3, gender=$4,
          date_of_birth=$5, contact_number=$6, backup_contact=$7,
          email=$8, address=$9, patient_type_id=$10
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
}
