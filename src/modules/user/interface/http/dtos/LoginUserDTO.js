export default class LoginUserDTO {
  constructor(body) {
    this.email = body.email;
    this.password = body.password;
  }
}
