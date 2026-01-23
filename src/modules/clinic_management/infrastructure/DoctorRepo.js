import IDoctorRepository from "../domain/repositories/IDoctorRepository.js";
import Doctor from "../domain/entities/Doctor.js";
import db from "../../../core/database/db.js";

export default class DoctorRepo extends IDoctorRepository {
  async save(doctor, actor) {
    const query = `
      INSERT INTO doctors 
      (f_name, m_name, l_name, specialization,
       license_number, years_experience, education,
       gender, address, is_verified, verification_status, user_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *;
    `;

    const values = [
      doctor.fName,
      doctor.mName,
      doctor.lName,
      doctor.specialization,
      doctor.licenseNumber,
      doctor.yearsExperience,
      doctor.education,
      doctor.gender,
      doctor.address,
      true,
      "Approved",
      actor,
    ];

    const result = await db.query(query, values);
    return this._toEntity(result.rows[0]);
  }

  async findById(id) {
    const result = await db.query(`SELECT * FROM doctors WHERE doctor_id=$1`, [
      id,
    ]);

    if (result.rows.length === 0) return null;
    return this._toEntity(result.rows[0]);
  }

  async updateVerificationStatus(doctorId, status) {
    const isVerified = status === "Approved";

    const result = await db.query(
      `UPDATE doctors 
       SET verification_status=$1, is_verified=$2 
       WHERE doctor_id=$3
       RETURNING *`,
      [status, isVerified, doctorId],
    );

    return this._toEntity(result.rows[0]);
  }

  async assignToClinic(doctorId, clinicId) {
    const result = await db.query(
      `INSERT INTO doctor_clinics (doctor_id, clinic_id) VALUES ($1, $2)
     ON CONFLICT (doctor_id, clinic_id) DO NOTHING`,
      [doctorId, clinicId],
    );

    return result.rows[0]; // no entity needed for junction table
  }

  async findAll() {
    const query = `
    SELECT *
    FROM doctors
    WHERE verification_status IN ('Pending', 'Approved')
    ORDER BY l_name ASC
  `;

    const result = await db.query(query);
    return result.rows.map((row) => this._toEntity(row));
  }

  async findByClinic(clinicId) {
    const query = `
    SELECT d.*
    FROM doctors d
    JOIN doctor_clinics dc ON dc.doctor_id = d.doctor_id
    WHERE dc.clinic_id = $1
    ORDER BY d.l_name ASC
  `;

    const result = await db.query(query, [clinicId]);
    return result.rows.map((row) => this._toEntity(row));
  }
  async findClinicsByDoctor(doctorId) {
    const query = `
    SELECT c.*
    FROM clinics c
    JOIN doctor_clinics dc ON dc.clinic_id = c.clinic_id
    WHERE dc.doctor_id = $1
    ORDER BY c.clinic_name ASC
  `;

    const result = await db.query(query, [doctorId]);
    return result.rows; // clinics don’t need entity mapping (your pattern)
  }

  /* PRIVATE: Map DB → Entity safely */
  _toEntity(row) {
    return new Doctor.Builder()
      .setDoctorId(row.doctor_id)
      .setFName(row.f_name)
      .setMName(row.m_name)
      .setLName(row.l_name)
      .setSpecialization(row.specialization)
      .setLicenseNumber(row.license_number)
      .setYearsExperience(row.years_experience)
      .setEducation(row.education)
      .setGender(row.gender)
      .setAddress(row.address)
      .setIsVerified(row.is_verified)
      .setVerificationStatus(row.verification_status)
      .setCreatedAt(row.created_at)
      .build();
  }

  // ============================================================
  // New & Planned api calls
  // ============================================================
  async getAllApprovedDoctorsOfUser(userId) {
    const query = `
SELECT d.*
FROM doctors d
WHERE d.user_id = $1
  AND d.is_verified = TRUE
  AND d.verification_status = 'Approved';

  `;

    const result = await db.query(query, [userId]);
    return result.rows;
  }

  async getAllDoctorsOfUser(userId) {
    const query = `
SELECT d.*
FROM doctors d
WHERE d.user_id = $1;

  `;

    const result = await db.query(query, [userId]);
    return result.rows;
  }

  async getAllInfoOfDoctor(doctorId, userId) {
    const query = `
SELECT d.*
FROM doctors d
WHERE d.user_id = $1;

  `;

    const result = await db.query(query, [userId]);
    return result.rows;
  }

  async updateDoctorInfo(doctorId, data) {
    const query = `
    UPDATE doctors
    SET
      f_name = COALESCE($1, f_name),
      m_name = COALESCE($2, m_name),
      l_name = COALESCE($3, l_name),
      specialization = COALESCE($4, specialization),
      license_number = COALESCE($5, license_number),
      years_experience = COALESCE($6, years_experience),
      education = COALESCE($7, education),
      gender = COALESCE($8, gender),
      address = COALESCE($9, address)
    WHERE doctor_id = $10
    RETURNING *;
  `;

    const values = [
      data.f_name ?? null,
      data.m_name ?? null,
      data.l_name ?? null,
      data.specialization ?? null,
      data.license_number ?? null,
      data.years_experience ?? null,
      data.education ?? null,
      data.gender ?? null,
      data.address ?? null,
      doctorId,
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }
}
