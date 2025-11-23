export default class DoctorSessionDTO {
  constructor(body) {
    this.doctorId = body.doctorId;
    this.clinicId = body.clinicId;
    this.dayOfWeek = body.dayOfWeek;
    this.startTime = body.startTime;
    this.endTime = body.endTime;
  }
}
