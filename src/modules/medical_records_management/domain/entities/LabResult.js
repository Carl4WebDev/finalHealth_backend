export default class LabResult {
  constructor(builder) {
    this.resultId = builder.resultId;
    this.appointmentId = builder.appointmentId;
    this.patientId = builder.patientId;
    this.testDate = builder.testDate;
    this.testType = builder.testType;
    this.result = builder.result;
    this.interpretation = builder.interpretation;
    this.labImgPath = builder.labImgPath;
    this.createdAt = builder.createdAt || new Date();
  }

  static get Builder() {
    return class {
      setResultId(v) {
        this.resultId = v;
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
      setTestDate(v) {
        this.testDate = v;
        return this;
      }
      setTestType(v) {
        this.testType = v;
        return this;
      }
      setResult(v) {
        this.result = v;
        return this;
      }
      setInterpretation(v) {
        this.interpretation = v;
        return this;
      }
      setLabImgPath(v) {
        this.labImgPath = v;
        return this;
      }
      setCreatedAt(v) {
        this.createdAt = v;
        return this;
      }

      build() {
        if (!this.appointmentId) throw new Error("appointmentId required");
        if (!this.patientId) throw new Error("patientId required");
        if (!this.testDate) throw new Error("testDate required");
        if (!this.testType) throw new Error("testType required");
        return new LabResult(this);
      }
    };
  }

  toBuilder() {
    return new LabResult.Builder()
      .setResultId(this.resultId)
      .setAppointmentId(this.appointmentId)
      .setPatientId(this.patientId)
      .setTestDate(this.testDate)
      .setTestType(this.testType)
      .setResult(this.result)
      .setInterpretation(this.interpretation)
      .setLabImgPath(this.labImgPath)
      .setCreatedAt(this.createdAt);
  }
}
