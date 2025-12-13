import ValidationError from "../../../../../core/errors/ValidationError.js";

export default class LoginUserDTO {
  constructor(payload = {}) {
    const { email, password } = payload;

    // STRICT WHITELIST
    this.email = email;
    this.password = password;

    this.validate();
  }

  validate() {
    if (!this.email)
      throw new ValidationError("Email is required", { field: "email" });

    if (!this.password)
      throw new ValidationError("Password is required", { field: "password" });

    if (this.email.length > 255)
      throw new ValidationError("Email too long", { max: 255 });

    if (this.password.length > 128)
      throw new ValidationError("Password too long", { max: 128 });
  }
}
