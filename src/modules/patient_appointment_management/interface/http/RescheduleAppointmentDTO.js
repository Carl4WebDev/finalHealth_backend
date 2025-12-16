import ValidationError from "../../../../core/errors/ValidationError.js";
import InputGuard from "../../../../core/security/InputGuard.js";

export default class RescheduleAppointmentDTO {
  constructor(body = {}, params = {}) {
    this.appointmentId = Number(params.id);
    this.appointmentDate = body.appointmentDate;
    this.appointmentType = body.appointmentType;
    this.priorityId =
      body.priorityId !== undefined ? Number(body.priorityId) : undefined;

    this.validate();
  }

  validate() {
    try {
      InputGuard.assertRequired("Appointment ID", this.appointmentId);
      InputGuard.assertRequired("Appointment date", this.appointmentDate);

      if (isNaN(this.appointmentId)) {
        throw new Error("Appointment ID must be a number");
      }

      if (this.priorityId !== undefined && isNaN(this.priorityId)) {
        throw new Error("Priority ID must be a number");
      }
    } catch (err) {
      throw new ValidationError(
        err.message,
        400,
        "RESCHEDULE_APPOINTMENT_VALIDATION_FAILED"
      );
    }
  }
}
