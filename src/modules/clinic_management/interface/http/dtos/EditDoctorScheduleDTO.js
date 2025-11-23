export default class EditDoctorScheduleDTO {
  constructor(body) {
    this.sessionId = body.sessionId; // Keep
    this.doctorId = body.doctorId; // Added
    this.clinicId = body.clinicId; // Added
    this.dayOfWeek = body.dayOfWeek;
    this.startTime = body.startTime;
    this.endTime = body.endTime;
  }
}
