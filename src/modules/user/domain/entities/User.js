export default class User {
  constructor(builder) {
    this.id = builder.id;
    this.email = builder.email;
    this.password = builder.password;
    this.status = builder.status || "Active";
    this.createdAt = builder.createdAt || new Date();
  }

  static get Builder() {
    return class {
      setId(id) {
        this.id = id;
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
      build() {
        if (!this.email || !this.password)
          throw new Error("Email and password required");
        return new User(this);
      }
    };
  }
}
