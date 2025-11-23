export default class RegisterClinicDTO {
  constructor(body) {
    this.clinicName = body.clinicName;
    this.address = body.address;
    this.contactNum = body.contactNum;
    this.backupNum = body.backupNum;
    this.openHours = body.openHours;
    this.openDays = body.openDays;
    this.businessPermitNo = body.businessPermitNo;
    this.ownerName = body.ownerName;
    this.profileImagePath = body.profileImagePath;
  }
}
