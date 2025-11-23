import DoctorSession from "../../domain/entities/DoctorSession.js";
export default class DoctorSessionService {
  constructor(sessionRepo, factory) {
    this.sessionRepo = sessionRepo;
    this.factory = factory;
  }

  async setAvailabilityWindow(dto) {
    // conflict check
    const conflicts = await this.sessionRepo.findConflicts(
      dto.doctorId,
      dto.clinicId,
      dto.dayOfWeek,
      dto.startTime,
      dto.endTime
    );

    if (conflicts.length > 0) throw new Error("Schedule conflict detected");

    const session = this.factory.createSession(dto);
    return await this.sessionRepo.save(session);
  }

  async editSchedule(dto) {
    console.log("here error service");
    const session = new DoctorSession.Builder()
      .setSessionId(dto.sessionId)
      .setDoctorId(dto.doctorId)
      .setClinicId(dto.clinicId)
      .setDayOfWeek(dto.dayOfWeek)
      .setStartTime(dto.startTime)
      .setEndTime(dto.endTime)
      .build();

    return await this.sessionRepo.update(session);
  }

  async deleteSchedule(sessionId) {
    return await this.sessionRepo.delete(sessionId);
  }

  async getDoctorSessions(doctorId) {
    return await this.sessionRepo.findByDoctor(doctorId);
  }

  async checkConflicts(dto) {
    return await this.sessionRepo.findConflicts(
      dto.doctorId,
      dto.clinicId,
      dto.dayOfWeek,
      dto.startTime,
      dto.endTime
    );
  }
}
