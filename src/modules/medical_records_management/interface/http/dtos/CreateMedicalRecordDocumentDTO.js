export default class CreateMedicalRecordDocumentDTO {
  constructor({ recordId, documentImgPath, uploadedBy }) {
    if (!recordId) throw new Error("recordId is required");
    if (!documentImgPath) throw new Error("documentImgPath is required");

    this.recordId = recordId;
    this.documentImgPath = documentImgPath;
    this.uploadedBy = uploadedBy ?? null;
  }
}
