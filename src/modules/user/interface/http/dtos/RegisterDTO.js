export default class RegisterUserDTO {
  constructor(body) {
    this.email = body.email;
    this.password = body.password;
    this.fName = body.fName;
    this.mName = body.mName ?? null;
    this.lName = body.lName;
    this.contactNum = body.contactNum;
    this.address = body.address ?? null;
    this.birthDate = body.birthDate ?? null;
  }
}
