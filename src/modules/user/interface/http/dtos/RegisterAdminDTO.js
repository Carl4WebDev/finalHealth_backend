export default class RegisterAdminDTO {
  constructor(data) {
    this.fName = data.fName;
    this.lName = data.lName;
    this.email = data.email;
    this.password = data.password;
  }
}
