import FollowupNote from "../../domain/entities/FollowupNote.js";

export default class FollowupNoteService {
  constructor(followupRepo) {
    this.followupRepo = followupRepo;
  }

  async createFollowup(dto) {
    const followup = new FollowupNote.Builder()
      .setAppointmentId(dto.appointmentId)
      .setPatientId(dto.patientId)
      .setFollowupDate(dto.followupDate)
      .setNotes(dto.notes)
      .setFollowupImgPath(dto.followupImgPath)
      .build();

    return await this.followupRepo.save(followup);
  }

  async updateFollowup(dto) {
    const existing = await this.followupRepo.findById(dto.followupId);
    if (!existing) throw new Error("Follow-up note not found");

    const updated = existing
      .toBuilder()
      .setFollowupDate(dto.followupDate ?? existing.followupDate)
      .setNotes(dto.notes ?? existing.notes)
      .setFollowupImgPath(
        dto.followupImgPath !== undefined
          ? dto.followupImgPath
          : existing.followupImgPath
      )
      .build();

    return await this.followupRepo.update(dto.followupId, updated);
  }

  async getById(id) {
    return await this.followupRepo.findById(id);
  }

  async listByAppointment(appointmentId) {
    return await this.followupRepo.findByAppointment(appointmentId);
  }

  async listByPatient(patientId) {
    return await this.followupRepo.findByPatient(patientId);
  }
}
