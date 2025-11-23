export default class Doctor {
  constructor(builder) {
    this.doctorId = builder.doctorId;
    this.fName = builder.fName;
    this.mName = builder.mName;
    this.lName = builder.lName;
    this.specialization = builder.specialization;
    this.licenseNumber = builder.licenseNumber;
    this.yearsExperience = builder.yearsExperience;
    this.education = builder.education;
    this.gender = builder.gender;
    this.address = builder.address;

    this.isVerified = builder.isVerified ?? false;
    this.verificationStatus = builder.verificationStatus || "Pending";
    this.createdAt = builder.createdAt || new Date();
  }

  approve(adminId) {
    this.isVerified = true;
    this.verificationStatus = "Approved";
  }

  reject(adminId, reason) {
    this.isVerified = false;
    this.verificationStatus = "Rejected";
  }

  static get Builder() {
    return class {
      setDoctorId(v) {
        this.doctorId = v;
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
      setSpecialization(v) {
        this.specialization = v;
        return this;
      }
      setLicenseNumber(v) {
        this.licenseNumber = v;
        return this;
      }
      setYearsExperience(v) {
        this.yearsExperience = v;
        return this;
      }
      setEducation(v) {
        this.education = v;
        return this;
      }
      setGender(v) {
        this.gender = v;
        return this;
      }
      setAddress(v) {
        this.address = v;
        return this;
      }
      setIsVerified(v) {
        this.isVerified = v;
        return this;
      }
      setVerificationStatus(v) {
        this.verificationStatus = v;
        return this;
      }
      setCreatedAt(v) {
        this.createdAt = v;
        return this;
      }

      build() {
        if (!this.fName) throw new Error("fName required");
        if (!this.lName) throw new Error("lName required");
        if (!this.specialization) throw new Error("specialization required");
        if (!this.licenseNumber) throw new Error("licenseNumber required");

        return new Doctor(this);
      }
    };
  }
}
