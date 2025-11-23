import IDoctorRepository from "../domain/repositories/IDoctorRepository.js";
import Doctor from "../domain/entities/Doctor.js";
import db from "../../../core/database/db.js";

export default class DoctorRepo extends IDoctorRepository {
  async save(doctor) {
    const query = `
      INSERT INTO doctors 
      (f_name, m_name, l_name, specialization,
       license_number, years_experience, education,
       gender, address, is_verified, verification_status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
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
      doctor.isVerified,
      doctor.verificationStatus,
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
      [status, isVerified, doctorId]
    );

    return this._toEntity(result.rows[0]);
  }

  async assignToClinic(doctorId, clinicId) {
    const result = await db.query(
      `INSERT INTO doctor_clinics (doctor_id, clinic_id)
       VALUES ($1, $2)
       RETURNING *`,
      [doctorId, clinicId]
    );

    return result.rows[0]; // no entity needed for junction table
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
}
