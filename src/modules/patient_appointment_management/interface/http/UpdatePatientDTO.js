import ValidationError from "../../../../core/errors/ValidationError.js";
import InputGuard from "../../../../core/security/InputGuard.js";

export default class UpdatePatientDTO {
  constructor(body = {}) {
    this.fName = body.fName;
    this.mName = body.mName;
    this.lName = body.lName;
    this.gender = body.gender;
    this.dateOfBirth = body.dateOfBirth;
    this.contactNumber = body.contactNumber;
    this.backupContact = body.backupContact;
    this.email = body.email;
    this.address = body.address;
    this.patientTypeId =
      body.patientTypeId !== undefined ? Number(body.patientTypeId) : undefined;

    this.validate();
  }

  validate() {
    // At least one field must be provided
    if (
      this.fName === undefined &&
      this.mName === undefined &&
      this.lName === undefined &&
      this.gender === undefined &&
      this.dateOfBirth === undefined &&
      this.contactNumber === undefined &&
      this.backupContact === undefined &&
      this.email === undefined &&
      this.address === undefined &&
      this.patientTypeId === undefined
    ) {
      throw new ValidationError("No fields provided for update");
    }

    // Validate only provided fields
    if (this.fName !== undefined) {
      InputGuard.assertPlainText("First name", this.fName);
      InputGuard.assertMaxLength("First name", this.fName, 100);
    }

    if (this.mName !== undefined) {
      InputGuard.assertPlainText("Middle name", this.mName);
      InputGuard.assertMaxLength("Middle name", this.mName, 100);
    }

    if (this.lName !== undefined) {
      InputGuard.assertPlainText("Last name", this.lName);
      InputGuard.assertMaxLength("Last name", this.lName, 100);
    }

    if (this.address !== undefined) {
      InputGuard.assertPlainText("Address", this.address);
      InputGuard.assertMaxLength("Address", this.address, 255);
    }

    if (this.contactNumber !== undefined) {
      InputGuard.assertPlainText("Contact number", this.contactNumber);
      InputGuard.assertMaxLength("Contact number", this.contactNumber, 50);
    }

    if (this.backupContact !== undefined) {
      InputGuard.assertPlainText("Backup contact", this.backupContact);
      InputGuard.assertMaxLength("Backup contact", this.backupContact, 50);
    }

    if (this.patientTypeId !== undefined && isNaN(this.patientTypeId)) {
      throw new ValidationError("Patient type must be a valid number");
    }
  }
}
