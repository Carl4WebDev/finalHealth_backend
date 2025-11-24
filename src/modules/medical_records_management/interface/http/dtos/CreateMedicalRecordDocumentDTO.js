export default class CreateMedicalRecordDocumentDTO {
  constructor(body) {
    this.recordId = Number(body.recordId);
    this.documentImgPath = body.documentImgPath;
    this.uploadedBy = body.uploadedBy ? Number(body.uploadedBy) : null;
  }
}
