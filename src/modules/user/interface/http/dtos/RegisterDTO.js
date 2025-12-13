import ValidationError from "../../../../../core/errors/ValidationError.js";

export default class RegisterUserDTO {
  constructor(payload = {}) {
    const {
      email,
      password,
      fName,
      mName,
      lName,
      contactNum,
      address,
      birthDate,
    } = payload;

    // STRICT WHITELIST
    this.email = email;
    this.password = password;
    this.fName = fName;
    this.mName = mName;
    this.lName = lName;
    this.contactNum = contactNum;
    this.address = address;
    this.birthDate = birthDate;

    this.validate();
  }

  // ------------------------------------------------------------
  // INTERNAL HELPERS
  // ------------------------------------------------------------
  containsHtml(value) {
    // Detect HTML tags or script-like patterns
    return /<[^>]*>/g.test(value);
  }

  validatePlainText(fieldName, value) {
    if (value && this.containsHtml(value)) {
      throw new ValidationError(`${fieldName} contains invalid characters`);
    }
  }

  // ------------------------------------------------------------
  // VALIDATION
  // ------------------------------------------------------------
  validate() {
    if (!this.email) throw new ValidationError("Email required");
    if (!this.password) throw new ValidationError("Password required");
    if (!this.fName) throw new ValidationError("First name required");
    if (!this.lName) throw new ValidationError("Last name required");

    if (this.email.length > 255) throw new ValidationError("Email too long");

    if (this.password.length < 6 || this.password.length > 128)
      throw new ValidationError("Password must be 6–128 characters");

    if (this.fName.length > 100 || this.lName.length > 100)
      throw new ValidationError("Name too long");

    if (this.address && this.address.length > 255)
      throw new ValidationError("Address too long");

    if (this.contactNum && this.contactNum.length > 20)
      throw new ValidationError("Contact number too long");

    // ----------------------------------------------------------
    // SCRIPT / HTML REJECTION (CRITICAL)
    // ----------------------------------------------------------
    this.validatePlainText("First name", this.fName);
    this.validatePlainText("Middle name", this.mName);
    this.validatePlainText("Last name", this.lName);
    this.validatePlainText("Address", this.address);
    this.validatePlainText("Contact number", this.contactNum);
  }
}
