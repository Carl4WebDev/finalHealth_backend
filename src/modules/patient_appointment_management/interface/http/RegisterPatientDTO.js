import ValidationError from "../../../../core/errors/ValidationError.js";
import InputGuard from "../../../../core/security/InputGuard.js";

export default class RegisterPatientDTO {
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
    this.priorityId = Number(body.priorityId);
    this.doctorId = Number(body.doctorId);
    this.clinicId = Number(body.clinicId);

    this.validate();
  }

  validate() {
    InputGuard.assertRequired("First name", this.fName);
    InputGuard.assertRequired("Last name", this.lName);
    InputGuard.assertRequired("Contact number", this.contactNumber);
    InputGuard.assertRequired("Patient type", this.priorityId);

    InputGuard.assertPlainText("First name", this.fName);
    InputGuard.assertPlainText("Last name", this.lName);
    InputGuard.assertPlainText("Address", this.address);

    InputGuard.assertMaxLength("First name", this.fName, 100);
    InputGuard.assertMaxLength("Last name", this.lName, 100);
  }
}
