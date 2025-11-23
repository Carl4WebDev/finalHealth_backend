export default class CreateAppointmentDTO {
  constructor(body) {
    this.patientId = Number(body.patientId);
    this.doctorId = Number(body.doctorId);
    this.clinicId = Number(body.clinicId);
    this.appointmentDate = body.appointmentDate; // ONLY DATE
    this.appointmentType = body.appointmentType;
    this.priorityId = Number(body.priorityId);
    this.status = "Scheduled";
  }
}
