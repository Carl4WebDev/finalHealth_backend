export default class MedicalRecordDocument {
  constructor(builder) {
    this.documentId = builder.documentId;
    this.recordId = builder.recordId;
    this.documentImgPath = builder.documentImgPath;
    this.uploadedAt = builder.uploadedAt || new Date();
    this.uploadedBy = builder.uploadedBy || null;
  }

  static get Builder() {
    return class {
      setDocumentId(v) {
        this.documentId = v;
        return this;
      }
      setRecordId(v) {
        this.recordId = v;
        return this;
      }
      setDocumentImgPath(v) {
        this.documentImgPath = v;
        return this;
      }
      setUploadedAt(v) {
        this.uploadedAt = v;
        return this;
      }
      setUploadedBy(v) {
        this.uploadedBy = v;
        return this;
      }

      build() {
        if (!this.recordId) throw new Error("recordId required");
        if (!this.documentImgPath) throw new Error("documentImgPath required");
        return new MedicalRecordDocument(this);
      }
    };
  }

  toBuilder() {
    return new MedicalRecordDocument.Builder()
      .setDocumentId(this.documentId)
      .setRecordId(this.recordId)
      .setDocumentImgPath(this.documentImgPath)
      .setUploadedAt(this.uploadedAt)
      .setUploadedBy(this.uploadedBy);
  }
}
