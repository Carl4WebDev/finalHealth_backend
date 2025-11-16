export default class Admin {
  constructor(builder) {
    this.adminId = builder.adminId;
    this.fName = builder.fName;
    this.lName = builder.lName;
    this.email = builder.email;
    this.password = builder.password;
    this.status = builder.status || "Active";
    this.createdAt = builder.createdAt || new Date();
  }

  isActive() {
    return this.status === "Active";
  }

  static get Builder() {
    return class {
      setAdminId(id) {
        this.adminId = id;
        return this;
      }
      setFName(name) {
        this.fName = name;
        return this;
      }
      setLName(name) {
        this.lName = name;
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
        if (!this.fName) throw new Error("fName required");
        if (!this.lName) throw new Error("lName required");
        if (!this.email) throw new Error("Email required");
        if (!this.password) throw new Error("Password required");

        return new Admin(this);
      }
    };
  }
}
