export default class Clinic {
  constructor(builder) {
    this.clinicId = builder.clinicId;
    this.clinicName = builder.clinicName;
    this.address = builder.address;
    this.contactNum = builder.contactNum;
    this.backupNum = builder.backupNum;
    this.openHours = builder.openHours;
    this.openDays = builder.openDays;
    this.businessPermitNo = builder.businessPermitNo;
    this.ownerName = builder.ownerName;
    this.dateRegistered = builder.dateRegistered || new Date();
    this.profileImagePath = builder.profileImagePath;
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
      setClinicId(v) {
        this.clinicId = v;
        return this;
      }
      setClinicName(v) {
        this.clinicName = v;
        return this;
      }
      setAddress(v) {
        this.address = v;
        return this;
      }
      setContactNum(v) {
        this.contactNum = v;
        return this;
      }
      setBackupNum(v) {
        this.backupNum = v;
        return this;
      }
      setOpenHours(v) {
        this.openHours = v;
        return this;
      }
      setOpenDays(v) {
        this.openDays = v;
        return this;
      }
      setBusinessPermitNo(v) {
        this.businessPermitNo = v;
        return this;
      }
      setOwnerName(v) {
        this.ownerName = v;
        return this;
      }
      setDateRegistered(v) {
        this.dateRegistered = v;
        return this;
      }
      setProfileImagePath(v) {
        this.profileImagePath = v;
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
        if (!this.clinicName) throw new Error("clinicName required");
        if (!this.address) throw new Error("address required");
        if (!this.contactNum) throw new Error("contactNum required");
        if (!this.businessPermitNo)
          throw new Error("businessPermitNo required");
        if (!this.ownerName) throw new Error("ownerName required");
        return new Clinic(this);
      }
    };
  }
}
