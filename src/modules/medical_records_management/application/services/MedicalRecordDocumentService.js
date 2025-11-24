import MedicalRecordDocument from "../../domain/entities/MedicalRecordDocument.js";

export default class MedicalRecordDocumentService {
  constructor(documentRepo) {
    this.documentRepo = documentRepo;
  }

  async createDocument(dto) {
    const doc = new MedicalRecordDocument.Builder()
      .setRecordId(dto.recordId)
      .setDocumentImgPath(dto.documentImgPath)
      .setUploadedBy(dto.uploadedBy)
      .build();

    return await this.documentRepo.save(doc);
  }

  async updateDocument(dto) {
    const existing = await this.documentRepo.findById(dto.documentId);
    if (!existing) throw new Error("Document not found");

    const updated = existing
      .toBuilder()
      .setDocumentImgPath(dto.documentImgPath ?? existing.documentImgPath)
      .setUploadedBy(
        dto.uploadedBy !== undefined ? dto.uploadedBy : existing.uploadedBy
      )
      .build();

    return await this.documentRepo.update(dto.documentId, updated);
  }

  async getById(id) {
    return await this.documentRepo.findById(id);
  }

  async listByRecord(recordId) {
    return await this.documentRepo.findByRecord(recordId);
  }
}
