import ValidationError from "../../../../core/errors/ValidationError.js";
import InputGuard from "../../../../core/security/InputGuard.js";

export default class CreateAppointmentDTO {
  constructor(body = {}) {
    this.patientId = Number(body.patientId);
    this.doctorId = Number(body.doctorId);
    this.clinicId = Number(body.clinicId);
    this.appointmentDate = body.appointmentDate;
    this.appointmentType = body.appointmentType;
    this.priorityId = Number(body.priorityId);
    this.status = "Scheduled";

    this.validate();
  }

  validate() {
    try {
      InputGuard.assertRequired("Patient ID", this.patientId);
      InputGuard.assertRequired("Doctor ID", this.doctorId);
      InputGuard.assertRequired("Clinic ID", this.clinicId);
      InputGuard.assertRequired("Appointment date", this.appointmentDate);
      InputGuard.assertRequired("Priority", this.priorityId);

      if (
        isNaN(this.patientId) ||
        isNaN(this.doctorId) ||
        isNaN(this.clinicId)
      ) {
        throw new Error("IDs must be valid numbers");
      }
    } catch (err) {
      throw new ValidationError(
        err.message,
        400,
        "CREATE_APPOINTMENT_VALIDATION_FAILED"
      );
    }
  }
}
