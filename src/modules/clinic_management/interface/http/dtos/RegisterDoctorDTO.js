export default class RegisterDoctorDTO {
  constructor(body) {
    this.fName = body.fName;
    this.mName = body.mName;
    this.lName = body.lName;
    this.specialization = body.specialization;
    this.licenseNumber = body.licenseNumber;
    this.yearsExperience = body.yearsExperience;
    this.education = body.education;
    this.gender = body.gender;
    this.address = body.address;
  }
}
