export default class DoctorSession {
  constructor(builder) {
    this.sessionId = builder.sessionId;
    this.doctorId = builder.doctorId;
    this.clinicId = builder.clinicId;
    this.dayOfWeek = builder.dayOfWeek;
    this.startTime = builder.startTime;
    this.endTime = builder.endTime;
    this.createdAt = builder.createdAt || new Date();
  }

  updateTimes(start, end) {
    this.startTime = start;
    this.endTime = end;
  }

  static get Builder() {
    return class {
      setSessionId(v) {
        this.sessionId = v;
        return this;
      }
      setDoctorId(v) {
        this.doctorId = v;
        return this;
      }
      setClinicId(v) {
        this.clinicId = v;
        return this;
      }
      setDayOfWeek(v) {
        this.dayOfWeek = v;
        return this;
      }
      setStartTime(v) {
        this.startTime = v;
        return this;
      }
      setEndTime(v) {
        this.endTime = v;
        return this;
      }
      setCreatedAt(v) {
        this.createdAt = v;
        return this;
      }

      build() {
        if (!this.doctorId) throw new Error("doctorId required");
        if (!this.clinicId) throw new Error("clinicId required");
        if (!this.dayOfWeek) throw new Error("dayOfWeek required");
        if (!this.startTime) throw new Error("startTime required");
        if (!this.endTime) throw new Error("endTime required");
        return new DoctorSession(this);
      }
    };
  }
}
