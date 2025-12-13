import ValidationError from "../../../../../core/errors/ValidationError.js";

export default class RegisterAdminDTO {
  constructor(data = {}) {
    this.fName = data.fName;
    this.lName = data.lName;
    this.email = data.email;
    this.password = data.password;

    this.validate();
  }

  validate() {
    if (!this.fName) throw new ValidationError("First name required");
    if (!this.lName) throw new ValidationError("Last name required");
    if (!this.email) throw new ValidationError("Email required");
    if (!this.password) throw new ValidationError("Password required");

    if (this.email.length > 255) throw new ValidationError("Email too long");

    if (this.password.length < 6 || this.password.length > 128)
      throw new ValidationError("Password must be 6–128 characters");
  }
}
