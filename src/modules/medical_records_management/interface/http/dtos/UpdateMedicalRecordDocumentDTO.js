export default class UpdateMedicalRecordDocumentDTO {
  constructor(body, params) {
    this.documentId = Number(params.id);
    this.documentImgPath = body.documentImgPath;
    this.uploadedBy = body.uploadedBy ? Number(body.uploadedBy) : undefined;
  }
}
