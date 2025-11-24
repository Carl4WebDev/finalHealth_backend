import IMedicalRecordDocumentRepository from "../domain/repositories/IMedicalRecordDocumentRepository.js";
import MedicalRecordDocument from "../domain/entities/MedicalRecordDocument.js";
import db from "../../../core/database/db.js";

export default class MedicalRecordDocumentRepo extends IMedicalRecordDocumentRepository {
  async save(doc) {
    const query = `
      INSERT INTO medical_record_documents
      (record_id, document_img_path, uploaded_by)
      VALUES ($1,$2,$3)
      RETURNING *;
    `;

    const values = [doc.recordId, doc.documentImgPath, doc.uploadedBy];

    const result = await db.query(query, values);
    return this._toEntity(result.rows[0]);
  }

  async update(id, updates) {
    const existing = await db.query(
      `SELECT * FROM medical_record_documents WHERE document_id=$1`,
      [id]
    );
    if (!existing.rows.length) return null;
    const row = existing.rows[0];

    const query = `
      UPDATE medical_record_documents
      SET 
        document_img_path=$1,
        uploaded_by=$2
      WHERE document_id=$3
      RETURNING *;
    `;

    const values = [
      updates.documentImgPath ?? row.document_img_path,
      updates.uploadedBy ?? row.uploaded_by,
      id,
    ];

    const updated = await db.query(query, values);
    return this._toEntity(updated.rows[0]);
  }

  async findById(id) {
    const result = await db.query(
      `SELECT * FROM medical_record_documents WHERE document_id=$1`,
      [id]
    );
    if (!result.rows.length) return null;
    return this._toEntity(result.rows[0]);
  }

  async findByRecord(recordId) {
    const result = await db.query(
      `SELECT * FROM medical_record_documents
       WHERE record_id=$1
       ORDER BY uploaded_at DESC`,
      [recordId]
    );
    return result.rows.map((r) => this._toEntity(r));
  }

  _toEntity(row) {
    return new MedicalRecordDocument.Builder()
      .setDocumentId(row.document_id)
      .setRecordId(row.record_id)
      .setDocumentImgPath(row.document_img_path)
      .setUploadedAt(row.uploaded_at)
      .setUploadedBy(row.uploaded_by)
      .build();
  }
}
