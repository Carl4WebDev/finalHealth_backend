export default class FollowupNote {
  constructor(builder) {
    this.followupId = builder.followupId;
    this.appointmentId = builder.appointmentId;
    this.patientId = builder.patientId;
    this.followupDate = builder.followupDate;
    this.notes = builder.notes;
    this.followupImgPath = builder.followupImgPath;
    this.createdAt = builder.createdAt || new Date();
  }

  static get Builder() {
    return class {
      setFollowupId(v) {
        this.followupId = v;
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
      setFollowupDate(v) {
        this.followupDate = v;
        return this;
      }
      setNotes(v) {
        this.notes = v;
        return this;
      }
      setFollowupImgPath(v) {
        this.followupImgPath = v;
        return this;
      }
      setCreatedAt(v) {
        this.createdAt = v;
        return this;
      }

      build() {
        if (!this.appointmentId) throw new Error("appointmentId required");
        if (!this.patientId) throw new Error("patientId required");
        if (!this.followupDate) throw new Error("followupDate required");
        return new FollowupNote(this);
      }
    };
  }

  toBuilder() {
    return new FollowupNote.Builder()
      .setFollowupId(this.followupId)
      .setAppointmentId(this.appointmentId)
      .setPatientId(this.patientId)
      .setFollowupDate(this.followupDate)
      .setNotes(this.notes)
      .setFollowupImgPath(this.followupImgPath)
      .setCreatedAt(this.createdAt);
  }
}
