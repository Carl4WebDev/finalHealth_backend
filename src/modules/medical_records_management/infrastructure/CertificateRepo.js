import ICertificateRepository from "../domain/repositories/ICertificateRepository.js";
import Certificate from "../domain/entities/certificates.js";
import db from "../../../core/database/db.js";

export default class CertificateRepo extends ICertificateRepository {
  async save(cert) {
    const query = `
      INSERT INTO certificates
      (appointment_id, patient_id, certificate_type, issue_date, remarks, certificates_img_path)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *;
    `;

    const values = [
      cert.appointmentId,
      cert.patientId,
      cert.certificateType,
      cert.issueDate,
      cert.remarks,
      cert.certificateImgPath,
    ];

    const result = await db.query(query, values);
    return this._toEntity(result.rows[0]);
  }

  async update(id, updates) {
    const existing = await db.query(
      `SELECT * FROM certificates WHERE certificates_id=$1`,
      [id]
    );

    if (existing.rows.length === 0) return null;
    const row = existing.rows[0];

    const certificateType = updates.certificateType ?? row.certificate_type;
    const issueDate = updates.issueDate ?? row.issue_date;
    const remarks = updates.remarks ?? row.remarks;
    const certificateImgPath =
      updates.certificateImgPath ?? row.certificates_img_path;

    const query = `
      UPDATE certificates
      SET 
        certificate_type=$1,
        issue_date=$2,
        remarks=$3,
        certificates_img_path=$4
      WHERE certificates_id=$5
      RETURNING *;
    `;

    const values = [
      certificateType,
      issueDate,
      remarks,
      certificateImgPath,
      id,
    ];

    const updated = await db.query(query, values);
    return this._toEntity(updated.rows[0]);
  }

  async findById(id) {
    const result = await db.query(
      `SELECT * FROM certificates WHERE certificates_id=$1`,
      [id]
    );
    if (!result.rows.length) return null;

    return this._toEntity(result.rows[0]);
  }

  async findByAppointment(appointmentId) {
    const result = await db.query(
      `SELECT * FROM certificates
       WHERE appointment_id=$1
       ORDER BY issue_date DESC, created_at DESC`,
      [appointmentId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  async findByPatient(patientId) {
    const result = await db.query(
      `SELECT * FROM certificates
       WHERE patient_id=$1
       ORDER BY issue_date DESC, created_at DESC`,
      [patientId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  _toEntity(row) {
    return new Certificate.Builder()
      .setCertificateId(row.certificates_id)
      .setAppointmentId(row.appointment_id)
      .setPatientId(row.patient_id)
      .setCertificateType(row.certificate_type)
      .setIssueDate(row.issue_date)
      .setRemarks(row.remarks)
      .setCertificateImgPath(row.certificates_img_path)
      .setCreatedAt(row.created_at)
      .build();
  }
}
