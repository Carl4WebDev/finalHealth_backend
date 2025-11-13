export default class User {
  constructor(builder) {
    this.userId = builder.userId;
    this.email = builder.email;
    this.password = builder.password;
    this.status = builder.status || "Active";
    this.createdAt = builder.createdAt || new Date();
  }

  static get Builder() {
    return class {
      setUserId(id) {
        this.userId = id;
        return this;
      }

      setEmail(email) {
        this.email = email;
        return this;
      }

      setPassword(password) {
        this.password = password;
        return this;
      }

      setStatus(status) {
        this.status = status;
        return this;
      }

      setCreatedAt(date) {
        this.createdAt = date;
        return this;
      }

      build() {
        if (!this.email) throw new Error("Email required");
        if (!this.password) throw new Error("Password required");

        return new User(this);
      }
    };
  }
}
