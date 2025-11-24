export default class UpdateCertificateDTO {
  constructor(body, params) {
    this.certificateId = Number(params.id);
    this.certificateType = body.certificateType;
    this.issueDate = body.issueDate;
    this.remarks = body.remarks || null;
    this.certificateImgPath = body.certificateImgPath || null;
  }
}
