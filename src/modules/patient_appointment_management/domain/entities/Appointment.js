export default class Appointment {
  constructor(builder) {
    this.appointmentId = builder.appointmentId;
    this.patientId = builder.patientId;
    this.doctorId = builder.doctorId;
    this.clinicId = builder.clinicId;

    this.appointmentDate = builder.appointmentDate; // ONLY DATE

    this.appointmentType = builder.appointmentType;
    this.priorityId = builder.priorityId;
    this.status = builder.status || "Scheduled";
    this.createdAt = builder.createdAt || new Date();
  }

  markCompleted() {
    this.status = "Completed";
  }

  cancel(reason) {
    this.status = "Cancelled";
    this.cancelReason = reason || null;
  }

  reschedule(newDate) {
    this.appointmentDate = newDate;
    this.status = "Scheduled";
  }

  static get Builder() {
    return class {
      setAppointmentId(v) {
        this.appointmentId = v;
        return this;
      }
      setPatientId(v) {
        this.patientId = v;
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
      setAppointmentDate(v) {
        this.appointmentDate = v;
        return this;
      }

      setAppointmentType(v) {
        this.appointmentType = v;
        return this;
      }
      setPriorityId(v) {
        this.priorityId = v;
        return this;
      }
      setStatus(v) {
        this.status = v;
        return this;
      }
      setCreatedAt(v) {
        this.createdAt = v;
        return this;
      }

      build() {
        if (!this.patientId) throw new Error("patientId required");
        if (!this.doctorId) throw new Error("doctorId required");
        if (!this.clinicId) throw new Error("clinicId required");
        if (!this.appointmentDate) throw new Error("appointmentDate required");
        if (!this.appointmentType) throw new Error("appointmentType required");
        if (this.priorityId === undefined || this.priorityId === null)
          throw new Error("priorityId required");

        return new Appointment(this);
      }
    };
  }

  toBuilder() {
    return new Appointment.Builder()
      .setAppointmentId(this.appointmentId)
      .setPatientId(this.patientId)
      .setDoctorId(this.doctorId)
      .setClinicId(this.clinicId)
      .setAppointmentDate(this.appointmentDate)
      .setAppointmentType(this.appointmentType)
      .setPriorityId(this.priorityId)
      .setStatus(this.status)
      .setCreatedAt(this.createdAt);
  }
}
