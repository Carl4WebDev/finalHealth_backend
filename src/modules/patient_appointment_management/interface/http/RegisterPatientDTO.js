export default class RegisterPatientDTO {
  constructor(body) {
    this.fName = body.fName;
    this.mName = body.mName;
    this.lName = body.lName;
    this.gender = body.gender;
    this.dateOfBirth = body.dateOfBirth;
    this.contactNumber = body.contactNumber;
    this.backupContact = body.backupContact;
    this.email = body.email;
    this.address = body.address;
    this.patientTypeId = Number(body.patientTypeId); // type of patient (number)
  }
}
