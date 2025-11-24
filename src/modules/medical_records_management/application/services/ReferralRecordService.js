import ReferralRecord from "../../domain/entities/ReferralRecord.js";

export default class ReferralRecordService {
  constructor(refRepo) {
    this.refRepo = refRepo;
  }

  async createReferral(dto) {
    const referral = new ReferralRecord.Builder()
      .setAppointmentId(dto.appointmentId)
      .setPatientId(dto.patientId)
      .setReferredTo(dto.referredTo)
      .setReason(dto.reason)
      .setNotes(dto.notes)
      .setReferralImgPath(dto.referralImgPath)
      .build();

    return await this.refRepo.save(referral);
  }

  async updateReferral(dto) {
    const existing = await this.refRepo.findById(dto.referralId);
    if (!existing) throw new Error("Referral record not found");

    const updated = existing
      .toBuilder()
      .setReferredTo(dto.referredTo ?? existing.referredTo)
      .setReason(dto.reason ?? existing.reason)
      .setNotes(dto.notes ?? existing.notes)
      .setReferralImgPath(
        dto.referralImgPath !== undefined
          ? dto.referralImgPath
          : existing.referralImgPath
      )
      .build();

    return await this.refRepo.update(dto.referralId, updated);
  }

  async getById(id) {
    return await this.refRepo.findById(id);
  }

  async listByAppointment(appointmentId) {
    return await this.refRepo.findByAppointment(appointmentId);
  }

  async listByPatient(patientId) {
    return await this.refRepo.findByPatient(patientId);
  }
}
