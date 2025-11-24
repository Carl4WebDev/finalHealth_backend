export default class CreateLabResultDTO {
  constructor(body) {
    this.appointmentId = Number(body.appointmentId);
    this.patientId = Number(body.patientId);
    this.testDate = body.testDate; // "YYYY-MM-DD"
    this.testType = body.testType;
    this.result = body.result || null;
    this.interpretation = body.interpretation || null;
    this.labImgPath = body.labImgPath || null; // folder/file path only
  }
}
