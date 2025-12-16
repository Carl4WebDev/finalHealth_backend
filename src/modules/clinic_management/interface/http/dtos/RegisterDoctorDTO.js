import ValidationError from "../../../../../core/errors/ValidationError.js";
import InputGuard from "../../../../../core/security/InputGuard.js";

export default class RegisterDoctorDTO {
  constructor(body = {}) {
    this.fName = body.fName;
    this.mName = body.mName;
    this.lName = body.lName;
    this.specialization = body.specialization;
    this.licenseNumber = body.licenseNumber;
    this.yearsExperience = body.yearsExperience;
    this.education = body.education;
    this.gender = body.gender;
    this.address = body.address;

    this.validate();
  }

  validate() {
    // ===========================
    // REQUIRED FIELDS
    // ===========================
    InputGuard.assertRequired("First name", this.fName);
    InputGuard.assertRequired("Last name", this.lName);
    InputGuard.assertRequired("Specialization", this.specialization);
    InputGuard.assertRequired("License number", this.licenseNumber);

    // ===========================
    // PLAIN TEXT CHECKS
    // ===========================
    InputGuard.assertPlainText("First name", this.fName);
    InputGuard.assertPlainText("Middle name", this.mName);
    InputGuard.assertPlainText("Last name", this.lName);
    InputGuard.assertPlainText("Specialization", this.specialization);
    InputGuard.assertPlainText("License number", this.licenseNumber);
    InputGuard.assertPlainText("Education", this.education);
    InputGuard.assertPlainText("Address", this.address);

    // ===========================
    // MAX LENGTH CONSTRAINTS
    // ===========================
    InputGuard.assertMaxLength("First name", this.fName, 100);
    InputGuard.assertMaxLength("Middle name", this.mName, 100);
    InputGuard.assertMaxLength("Last name", this.lName, 100);
    InputGuard.assertMaxLength("Specialization", this.specialization, 150);
    InputGuard.assertMaxLength("License number", this.licenseNumber, 50);
    InputGuard.assertMaxLength("Education", this.education, 255);
    InputGuard.assertMaxLength("Address", this.address, 255);

    // ===========================
    // DOMAIN-SPECIFIC VALIDATION
    // ===========================
    if (
      this.yearsExperience !== undefined &&
      (!Number.isInteger(this.yearsExperience) || this.yearsExperience < 0)
    ) {
      throw new ValidationError(
        "Years of experience must be a non-negative integer"
      );
    }

    if (this.gender && !["Male", "Female", "Other"].includes(this.gender)) {
      throw new ValidationError("Invalid gender value");
    }
  }
}
