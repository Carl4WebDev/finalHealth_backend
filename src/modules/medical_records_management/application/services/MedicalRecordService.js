import MedicalRecord from "../../domain/entities/MedicalRecord.js";

export default class MedicalRecordService {
  constructor(medicalRecordRepo) {
    this.medicalRecordRepo = medicalRecordRepo;
  }

  _computeTotal(consultationFee, medicineFee, labFee, otherFee) {
    const c = consultationFee || 0;
    const m = medicineFee || 0;
    const l = labFee || 0;
    const o = otherFee || 0;
    return c + m + l + o;
  }

  async createMedicalRecord(dto) {
    const totalAmount =
      dto.totalAmount !== null && dto.totalAmount !== undefined
        ? dto.totalAmount
        : this._computeTotal(
            dto.consultationFee,
            dto.medicineFee,
            dto.labFee,
            dto.otherFee
          );

    const record = new MedicalRecord.Builder()
      .setAppointmentId(dto.appointmentId)
      .setPatientId(dto.patientId)
      .setRecordDate(dto.recordDate)
      .setDiagnosis(dto.diagnosis)
      .setTreatment(dto.treatment)
      .setMedications(dto.medications)
      .setAssessment(dto.assessment)
      .setIsContagious(dto.isContagious)
      .setContagiousDescription(dto.contagiousDescription)
      .setConsultationFee(dto.consultationFee)
      .setMedicineFee(dto.medicineFee)
      .setLabFee(dto.labFee)
      .setOtherFee(dto.otherFee)
      .setTotalAmount(totalAmount)
      .build();

    return await this.medicalRecordRepo.save(record);
  }

  async updateMedicalRecord(dto) {
    const existing = await this.medicalRecordRepo.findById(dto.recordId);
    if (!existing) throw new Error("Medical record not found");

    // Build the updated entity (all numeric fields are force-casted)
    const updated = existing
      .toBuilder()
      .setRecordDate(dto.recordDate ?? existing.recordDate)
      .setDiagnosis(dto.diagnosis ?? existing.diagnosis)
      .setTreatment(dto.treatment ?? existing.treatment)
      .setMedications(dto.medications ?? existing.medications)
      .setAssessment(dto.assessment ?? existing.assessment)
      .setIsContagious(
        dto.isContagious !== undefined
          ? Boolean(dto.isContagious)
          : existing.isContagious
      )
      .setContagiousDescription(
        dto.contagiousDescription ?? existing.contagiousDescription
      )
      .setConsultationFee(
        dto.consultationFee !== undefined
          ? Number(dto.consultationFee)
          : existing.consultationFee
      )
      .setMedicineFee(
        dto.medicineFee !== undefined
          ? Number(dto.medicineFee)
          : existing.medicineFee
      )
      .setLabFee(
        dto.labFee !== undefined ? Number(dto.labFee) : existing.labFee
      )
      .setOtherFee(
        dto.otherFee !== undefined ? Number(dto.otherFee) : existing.otherFee
      )
      .build();

    // Recompute totalAmount or override if provided
    const computedTotal =
      updated.consultationFee +
      updated.medicineFee +
      updated.labFee +
      updated.otherFee;

    updated.totalAmount =
      dto.totalAmount !== undefined ? Number(dto.totalAmount) : computedTotal;

    return await this.medicalRecordRepo.update(dto.recordId, updated);
  }

  async getById(id) {
    return await this.medicalRecordRepo.findById(id);
  }

  async listByAppointment(appointmentId) {
    return await this.medicalRecordRepo.findByAppointment(appointmentId);
  }

  async listByPatient(patientId) {
    return await this.medicalRecordRepo.findByPatient(patientId);
  }
}
