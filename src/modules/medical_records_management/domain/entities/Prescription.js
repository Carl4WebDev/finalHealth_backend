export default class Prescription {
  constructor(builder) {
    this.prescriptionId = builder.prescriptionId;
    this.appointmentId = builder.appointmentId;
    this.patientId = builder.patientId;
    this.prescribedDate = builder.prescribedDate;
    this.medicationName = builder.medicationName;
    this.dosage = builder.dosage;
    this.frequency = builder.frequency;
    this.duration = builder.duration;
    this.instructions = builder.instructions;
    this.prescriptionImgPath = builder.prescriptionImgPath;
    this.createdAt = builder.createdAt || new Date();
  }

  static get Builder() {
    return class {
      setPrescriptionId(v) {
        this.prescriptionId = v;
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
      setPrescribedDate(v) {
        this.prescribedDate = v;
        return this;
      }
      setMedicationName(v) {
        this.medicationName = v;
        return this;
      }
      setDosage(v) {
        this.dosage = v;
        return this;
      }
      setFrequency(v) {
        this.frequency = v;
        return this;
      }
      setDuration(v) {
        this.duration = v;
        return this;
      }
      setInstructions(v) {
        this.instructions = v;
        return this;
      }
      setPrescriptionImgPath(v) {
        this.prescriptionImgPath = v;
        return this;
      }
      setCreatedAt(v) {
        this.createdAt = v;
        return this;
      }

      build() {
        if (!this.appointmentId) throw new Error("appointmentId required");
        if (!this.patientId) throw new Error("patientId required");
        if (!this.prescribedDate) throw new Error("prescribedDate required");
        if (!this.medicationName) throw new Error("medicationName required");
        return new Prescription(this);
      }
    };
  }

  toBuilder() {
    return new Prescription.Builder()
      .setPrescriptionId(this.prescriptionId)
      .setAppointmentId(this.appointmentId)
      .setPatientId(this.patientId)
      .setPrescribedDate(this.prescribedDate)
      .setMedicationName(this.medicationName)
      .setDosage(this.dosage)
      .setFrequency(this.frequency)
      .setDuration(this.duration)
      .setInstructions(this.instructions)
      .setPrescriptionImgPath(this.prescriptionImgPath)
      .setCreatedAt(this.createdAt);
  }
}
