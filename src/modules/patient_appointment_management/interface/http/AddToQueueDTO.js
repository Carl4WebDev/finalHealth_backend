import ValidationError from "../../../../core/errors/ValidationError.js";
import InputGuard from "../../../../core/security/InputGuard.js";

export default class AddToQueueDTO {
  constructor(body = {}) {
    this.patientId = Number(body.patientId);
    this.doctorId = Number(body.doctorId);
    this.clinicId = Number(body.clinicId);
    this.priorityId = Number(body.priorityId);
    this.status = body.status || "waiting";

    this.validate();
  }

  validate() {
    try {
      InputGuard.assertRequired("Patient ID", this.patientId);
      InputGuard.assertRequired("Doctor ID", this.doctorId);
      InputGuard.assertRequired("Clinic ID", this.clinicId);
      InputGuard.assertRequired("Priority ID", this.priorityId);

      if (
        isNaN(this.patientId) ||
        isNaN(this.doctorId) ||
        isNaN(this.clinicId) ||
        isNaN(this.priorityId)
      ) {
        throw new Error("IDs must be valid numbers");
      }
    } catch (err) {
      throw new ValidationError(err.message, 400, "QUEUE_VALIDATION_FAILED");
    }
  }
}
