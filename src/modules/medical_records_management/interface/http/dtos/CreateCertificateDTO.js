export default class CreateCertificateDTO {
  constructor(body) {
    this.appointmentId = Number(body.appointmentId);
    this.patientId = Number(body.patientId);
    this.certificateType = body.certificateType;
    this.issueDate = body.issueDate; // "YYYY-MM-DD"
    this.remarks = body.remarks || null;
    this.certificateImgPath = body.certificateImgPath || null;
  }
}
