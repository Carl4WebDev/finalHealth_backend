export default class ReferralRecord {
  constructor(builder) {
    this.referralId = builder.referralId;
    this.appointmentId = builder.appointmentId;
    this.patientId = builder.patientId;
    this.referredTo = builder.referredTo;
    this.reason = builder.reason;
    this.notes = builder.notes;
    this.referralImgPath = builder.referralImgPath;
    this.createdAt = builder.createdAt || new Date();
  }

  static get Builder() {
    return class {
      setReferralId(v) {
        this.referralId = v;
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
      setReferredTo(v) {
        this.referredTo = v;
        return this;
      }
      setReason(v) {
        this.reason = v;
        return this;
      }
      setNotes(v) {
        this.notes = v;
        return this;
      }
      setReferralImgPath(v) {
        this.referralImgPath = v;
        return this;
      }
      setCreatedAt(v) {
        this.createdAt = v;
        return this;
      }

      build() {
        if (!this.appointmentId) throw new Error("appointmentId required");
        if (!this.patientId) throw new Error("patientId required");
        return new ReferralRecord(this);
      }
    };
  }

  toBuilder() {
    return new ReferralRecord.Builder()
      .setReferralId(this.referralId)
      .setAppointmentId(this.appointmentId)
      .setPatientId(this.patientId)
      .setReferredTo(this.referredTo)
      .setReason(this.reason)
      .setNotes(this.notes)
      .setReferralImgPath(this.referralImgPath)
      .setCreatedAt(this.createdAt);
  }
}
