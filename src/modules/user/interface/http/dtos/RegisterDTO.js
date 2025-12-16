import InputGuard from "../../../../../core/security/InputGuard.js";
import ValidationError from "../../../../../core/errors/ValidationError.js";

export default class RegisterUserDTO {
  constructor(payload = {}) {
    Object.assign(this, payload);
    this.validate();
  }

  validate() {
    InputGuard.assertRequired("Email", this.email);
    InputGuard.assertRequired("Password", this.password);
    InputGuard.assertRequired("First name", this.fName);
    InputGuard.assertRequired("Last name", this.lName);

    InputGuard.assertPlainText("First name", this.fName);
    InputGuard.assertPlainText("Middle name", this.mName);
    InputGuard.assertPlainText("Last name", this.lName);
    InputGuard.assertPlainText("Address", this.address);
    InputGuard.assertPlainText("Contact number", this.contactNum);

    InputGuard.assertMaxLength("Email", this.email, 255);
    InputGuard.assertMaxLength("First name", this.fName, 100);
    InputGuard.assertMaxLength("Last name", this.lName, 100);
    InputGuard.assertMaxLength("Address", this.address, 255);

    if (this.password.length < 8 || this.password.length > 255) {
      throw new ValidationError("Password must be 8–255 characters");
    }
  }
}
