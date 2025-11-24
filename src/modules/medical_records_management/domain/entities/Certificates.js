export default class Certificate {
  constructor(builder) {
    this.certificateId = builder.certificateId;
    this.appointmentId = builder.appointmentId;
    this.patientId = builder.patientId;
    this.certificateType = builder.certificateType;
    this.issueDate = builder.issueDate;
    this.remarks = builder.remarks;
    this.certificateImgPath = builder.certificateImgPath;
    this.createdAt = builder.createdAt || new Date();
  }

  static get Builder() {
    return class {
      setCertificateId(v) {
        this.certificateId = v;
        return this;
      }
      setAppointmentId(v) {
        this.appointmentId = v;
        return this;
      }
      setPatientId(v) {
        this.patientId = v;
        return this;
      }
      setCertificateType(v) {
        this.certificateType = v;
        return this;
      }
      setIssueDate(v) {
        this.issueDate = v;
        return this;
      }
      setRemarks(v) {
        this.remarks = v;
        return this;
      }
      setCertificateImgPath(v) {
        this.certificateImgPath = v;
        return this;
      }
      setCreatedAt(v) {
        this.createdAt = v;
        return this;
      }

      build() {
        if (!this.appointmentId) throw new Error("appointmentId required");
        if (!this.patientId) throw new Error("patientId required");
        if (!this.certificateType) throw new Error("certificateType required");
        if (!this.issueDate) throw new Error("issueDate required");
        return new Certificate(this);
      }
    };
  }

  toBuilder() {
    return new Certificate.Builder()
      .setCertificateId(this.certificateId)
      .setAppointmentId(this.appointmentId)
      .setPatientId(this.patientId)
      .setCertificateType(this.certificateType)
      .setIssueDate(this.issueDate)
      .setRemarks(this.remarks)
      .setCertificateImgPath(this.certificateImgPath)
      .setCreatedAt(this.createdAt);
  }
}
