import IClinicRepository from "../domain/repositories/IClinicRepository.js";
import Clinic from "../domain/entities/Clinic.js";
import db from "../../../core/database/db.js";

export default class ClinicRepo extends IClinicRepository {
  /* ============================
     SAVE CLINIC
  ============================ */
  async save(clinic) {
    const query = `
      INSERT INTO clinics 
      (clinic_name, address, contact_num, backup_num, open_hours, open_days,
       business_permit_no, owner_name, profile_image_path, is_verified, verification_status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *;
    `;

    const values = [
      clinic.clinicName,
      clinic.address,
      clinic.contactNum,
      clinic.backupNum,
      clinic.openHours,
      clinic.openDays,
      clinic.businessPermitNo,
      clinic.ownerName,
      clinic.profileImagePath,
      clinic.isVerified,
      clinic.verificationStatus,
    ];

    const result = await db.query(query, values);
    return this._toEntity(result.rows[0]);
  }

  /* ============================
     FIND BY ID
  ============================ */
  async findById(clinicId) {
    const result = await db.query(`SELECT * FROM clinics WHERE clinic_id=$1`, [
      clinicId,
    ]);

    if (result.rows.length === 0) return null;

    return this._toEntity(result.rows[0]);
  }

  /* ============================
     UPDATE VERIFICATION STATUS
  ============================ */
  async updateVerificationStatus(clinicId, status) {
    const isVerified = status === "Approved";

    const query = `
      UPDATE clinics
      SET verification_status=$1,
          is_verified=$2
      WHERE clinic_id=$3
      RETURNING *;
    `;

    const result = await db.query(query, [status, isVerified, clinicId]);

    return this._toEntity(result.rows[0]);
  }

  /* ============================
     FIND ALL PENDING
  ============================ */
  async findPendingVerification() {
    const result = await db.query(
      `SELECT * FROM clinics WHERE verification_status='Pending'`
    );

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
    return result.rows;
  }

  /* ============================
     PRIVATE: MAP DB → ENTITY
  ============================ */
  _toEntity(row) {
    if (!row) return null;

    return new Clinic.Builder()
      .setClinicId(row.clinic_id)
      .setClinicName(row.clinic_name)
      .setAddress(row.address)
      .setContactNum(row.contact_num)
      .setBackupNum(row.backup_num)
      .setOpenHours(row.open_hours)
      .setOpenDays(row.open_days)
      .setBusinessPermitNo(row.business_permit_no)
      .setOwnerName(row.owner_name)
      .setDateRegistered(row.date_registered)
      .setProfileImagePath(row.profile_image_path)
      .setIsVerified(row.is_verified)
      .setVerificationStatus(row.verification_status)
      .setCreatedAt(row.created_at)
      .build();
  }
}
