import ValidationError from "../../../../../core/errors/ValidationError.js";
import InputGuard from "../../../../../core/security/InputGuard.js";

export default class RegisterClinicDTO {
  constructor(body = {}) {
    this.clinicName = body.clinicName;
    this.address = body.address;
    this.contactNum = body.contactNum;
    this.backupNum = body.backupNum;
    this.openHours = body.openHours;
    this.openDays = body.openDays;
    this.businessPermitNo = body.businessPermitNo;
    this.ownerName = body.ownerName;
    this.profileImagePath = body.profileImagePath;

    this.validate();
  }

  validate() {
    InputGuard.assertRequired("Clinic name", this.clinicName);
    InputGuard.assertRequired("Address", this.address);
    InputGuard.assertRequired("Contact number", this.contactNum);
    InputGuard.assertRequired("Owner name", this.ownerName);

    InputGuard.assertPlainText("Clinic name", this.clinicName);
    InputGuard.assertPlainText("Address", this.address);
    InputGuard.assertPlainText("Owner name", this.ownerName);
    InputGuard.assertPlainText("Open hours", this.openHours);
    InputGuard.assertPlainText("Open days", this.openDays);
    InputGuard.assertPlainText("Business permit", this.businessPermitNo);

    InputGuard.assertMaxLength("Clinic name", this.clinicName, 150);
    InputGuard.assertMaxLength("Address", this.address, 255);
    InputGuard.assertMaxLength("Owner name", this.ownerName, 150);
    InputGuard.assertMaxLength("Open hours", this.openHours, 100);
    InputGuard.assertMaxLength("Open days", this.openDays, 100);
  }
}
