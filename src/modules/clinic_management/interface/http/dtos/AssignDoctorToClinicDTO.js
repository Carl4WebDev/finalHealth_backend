import ValidationError from "../../../../../core/errors/ValidationError.js";
import InputGuard from "../../../../../core/security/InputGuard.js";

export default class AssignDoctorToClinicDTO {
  constructor(body = {}) {
    this.doctorId = body.doctorId;
    this.clinicId = body.clinicId;

    this.validate();
  }

  validate() {
    // ===========================
    // REQUIRED
    // ===========================
    InputGuard.assertRequired("Doctor ID", this.doctorId);
    InputGuard.assertRequired("Clinic ID", this.clinicId);

    // ===========================
    // TYPE & RANGE CHECKS
    // ===========================
    if (!Number.isInteger(this.doctorId) || this.doctorId <= 0) {
      throw new ValidationError("Doctor ID must be a positive integer");
    }

    if (!Number.isInteger(this.clinicId) || this.clinicId <= 0) {
      throw new ValidationError("Clinic ID must be a positive integer");
    }
  }
}
