import ValidationError from "../errors/ValidationError.js";

export default class InputGuard {
  static containsHtml(value) {
    return /<[^>]*>/g.test(value);
  }

  static assertPlainText(fieldName, value) {
    if (!value) return;

    if (typeof value !== "string") {
      throw new ValidationError(`${fieldName} must be a string`);
    }

    if (this.containsHtml(value)) {
      throw new ValidationError(`${fieldName} contains invalid characters`);
    }
  }

  static assertMaxLength(fieldName, value, max) {
    if (value && value.length > max) {
      throw new ValidationError(`${fieldName} too long (max ${max})`);
    }
  }

  static assertRequired(fieldName, value) {
    if (!value) {
      throw new ValidationError(`${fieldName} is required`);
    }
  }
}
