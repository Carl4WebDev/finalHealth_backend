import ValidationError from "../../../../../core/errors/ValidationError.js";

export default class LoginAdminDTO {
  constructor(data = {}) {
    this.email = data.email;
    this.password = data.password;

    this.validate();
  }

  validate() {
    if (!this.email || !this.password) {
      throw new ValidationError("Email and password are required");
    }
  }
}
