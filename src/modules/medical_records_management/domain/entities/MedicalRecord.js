export default class MedicalRecord {
  constructor(builder) {
    this.recordId = builder.recordId;
    this.appointmentId = builder.appointmentId;
    this.patientId = builder.patientId;
    this.recordDate = builder.recordDate;

    this.diagnosis = builder.diagnosis;
    this.treatment = builder.treatment;
    this.medications = builder.medications;
    this.assessment = builder.assessment;

    this.isContagious = builder.isContagious;
    this.contagiousDescription = builder.contagiousDescription;

    this.consultationFee = builder.consultationFee;
    this.medicineFee = builder.medicineFee;
    this.labFee = builder.labFee;
    this.otherFee = builder.otherFee;
    this.totalAmount = builder.totalAmount;

    this.createdAt = builder.createdAt || new Date();
  }

  static get Builder() {
    return class {
      setRecordId(v) {
        this.recordId = v;
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
      setRecordDate(v) {
        this.recordDate = v;
        return this;
      }
      setDiagnosis(v) {
        this.diagnosis = v;
        return this;
      }
      setTreatment(v) {
        this.treatment = v;
        return this;
      }
      setMedications(v) {
        this.medications = v;
        return this;
      }
      setAssessment(v) {
        this.assessment = v;
        return this;
      }
      setIsContagious(v) {
        this.isContagious = v;
        return this;
      }
      setContagiousDescription(v) {
        this.contagiousDescription = v;
        return this;
      }
      setConsultationFee(v) {
        this.consultationFee = v;
        return this;
      }
      setMedicineFee(v) {
        this.medicineFee = v;
        return this;
      }
      setLabFee(v) {
        this.labFee = v;
        return this;
      }
      setOtherFee(v) {
        this.otherFee = v;
        return this;
      }
      setTotalAmount(v) {
        this.totalAmount = v;
        return this;
      }
      setCreatedAt(v) {
        this.createdAt = v;
        return this;
      }

      build() {
        if (!this.appointmentId) throw new Error("appointmentId required");
        if (!this.patientId) throw new Error("patientId required");
        if (!this.recordDate) throw new Error("recordDate required");
        return new MedicalRecord(this);
      }
    };
  }

  toBuilder() {
    return new MedicalRecord.Builder()
      .setRecordId(this.recordId)
      .setAppointmentId(this.appointmentId)
      .setPatientId(this.patientId)
      .setRecordDate(this.recordDate)
      .setDiagnosis(this.diagnosis)
      .setTreatment(this.treatment)
      .setMedications(this.medications)
      .setAssessment(this.assessment)
      .setIsContagious(this.isContagious)
      .setContagiousDescription(this.contagiousDescription)
      .setConsultationFee(this.consultationFee)
      .setMedicineFee(this.medicineFee)
      .setLabFee(this.labFee)
      .setOtherFee(this.otherFee)
      .setTotalAmount(this.totalAmount)
      .setCreatedAt(this.createdAt);
  }
}
