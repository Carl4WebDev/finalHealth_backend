import DoctorSession from "../../domain/entities/DoctorSession.js";

export default class DoctorSessionService {
  constructor(sessionRepo, factory, auditService) {
    this.sessionRepo = sessionRepo;
    this.factory = factory;
    this.auditService = auditService; // NEW
  }

  async setAvailabilityWindow(dto, actor) {
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
    const saved = await this.sessionRepo.save(session);

    // AUDIT LOG — REQ040
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "DOCTOR_SESSION_CREATED",
      tableAffected: "doctor_session",
      recordId: saved.sessionId,
      details: JSON.stringify(dto),
    });

    return saved;
  }

  async editSchedule(dto, actor) {
    const session = new DoctorSession.Builder()
      .setSessionId(dto.sessionId)
      .setDoctorId(dto.doctorId)
      .setClinicId(dto.clinicId)
      .setDayOfWeek(dto.dayOfWeek)
      .setStartTime(dto.startTime)
      .setEndTime(dto.endTime)
      .build();

    const updated = await this.sessionRepo.update(session);

    // AUDIT LOG
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "DOCTOR_SESSION_UPDATED",
      tableAffected: "doctor_session",
      recordId: dto.sessionId,
      details: JSON.stringify(dto),
    });

    return updated;
  }

  async deleteSchedule(sessionId, actor) {
    await this.sessionRepo.delete(sessionId);

    // AUDIT LOG
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "DOCTOR_SESSION_DELETED",
      tableAffected: "doctor_session",
      recordId: sessionId,
      details: `Deleted doctor session ${sessionId}`,
    });

    return true;
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
