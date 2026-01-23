export default class Patient {
  constructor(builder) {
    this.patientId = builder.patientId;
    this.fName = builder.fName;
    this.mName = builder.mName;
    this.lName = builder.lName;
    this.gender = builder.gender;
    this.dateOfBirth = builder.dateOfBirth;
    this.contactNumber = builder.contactNumber;
    this.backupContact = builder.backupContact;
    this.email = builder.email;
    this.address = builder.address;
    this.priorityId = builder.priorityId; // numeric type of patient
    this.createdAt = builder.createdAt || new Date();
  }

  getFullName() {
    return [this.fName, this.mName, this.lName].filter(Boolean).join(" ");
  }

  getAge() {
    if (!this.dateOfBirth) return null;
    const dob = new Date(this.dateOfBirth);
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
    return age;
  }

  updateContact(num) {
    this.contactNumber = num;
  }

  updateAddress(addr) {
    this.address = addr;
  }

  static get Builder() {
    return class {
      setPatientId(v) {
        this.patientId = v;
        return this;
      }
      setFName(v) {
        this.fName = v;
        return this;
      }
      setMName(v) {
        this.mName = v;
        return this;
      }
      setLName(v) {
        this.lName = v;
        return this;
      }
      setGender(v) {
        this.gender = v;
        return this;
      }
      setDateOfBirth(v) {
        this.dateOfBirth = v;
        return this;
      }
      setContactNumber(v) {
        this.contactNumber = v;
        return this;
      }
      setBackupContact(v) {
        this.backupContact = v;
        return this;
      }
      setEmail(v) {
        this.email = v;
        return this;
      }
      setAddress(v) {
        this.address = v;
        return this;
      }
      setPriorityId(v) {
        this.priorityId = v;
        return this;
      }
      setCreatedAt(v) {
        this.createdAt = v;
        return this;
      }

      build() {
        if (!this.fName) throw new Error("fName required");
        if (!this.lName) throw new Error("lName required");
        if (!this.dateOfBirth) throw new Error("dateOfBirth required");
        if (!this.contactNumber) throw new Error("contactNumber required");
        if (!this.address) throw new Error("address required");
        if (this.priorityId == null) throw new Error("patientTypeId required");
        return new Patient(this);
      }
    };
  }

  toBuilder() {
    return new Patient.Builder()
      .setPatientId(this.patientId)
      .setFName(this.fName)
      .setMName(this.mName)
      .setLName(this.lName)
      .setGender(this.gender)
      .setDateOfBirth(this.dateOfBirth)
      .setContactNumber(this.contactNumber)
      .setBackupContact(this.backupContact)
      .setEmail(this.email)
      .setAddress(this.address)
      .setPriorityId(this.priorityId)
      .setCreatedAt(this.createdAt);
  }
}
