export default class RescheduleAppointmentDTO {
  constructor(body, params) {
    this.appointmentId = Number(params.id);
    this.appointmentDate = body.appointmentDate;
    this.appointmentType = body.appointmentType;
    this.priorityId = Number(body.priorityId);
  }
}
