export default class AdminResponseDTO {
  constructor(admin) {
    this.adminId = admin.adminId;
    this.fName = admin.fName;
    this.lName = admin.lName;
    this.email = admin.email;
    this.status = admin.status;
    this.createdAt = admin.createdAt;
  }
}
