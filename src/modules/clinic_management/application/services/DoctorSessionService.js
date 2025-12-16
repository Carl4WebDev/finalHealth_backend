import AppError from "../../../../core/errors/AppError.js";
import ValidationError from "../../../../core/errors/ValidationError.js";

import DoctorSessionCreated from "../../domain/events/doctor_sessions/DoctorSessionCreated.js";
import DoctorSessionUpdated from "../../domain/events/doctor_sessions/DoctorSessionUpdated.js";
import DoctorSessionDeleted from "../../domain/events/doctor_sessions/DoctorSessionDeleted.js";

export default class DoctorSessionService {
  constructor(sessionRepo, factory, eventBus) {
    this.sessionRepo = sessionRepo;
    this.factory = factory;
    this.eventBus = eventBus;
  }

  // ============================================================
  // CREATE SESSION
  // ============================================================
  async setAvailabilityWindow(dto, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const conflicts = await this.sessionRepo.findConflicts(
      dto.doctorId,
      dto.clinicId,
      dto.dayOfWeek,
      dto.startTime,
      dto.endTime
    );

    if (conflicts.length > 0) {
      throw new AppError(
        "Schedule conflict detected",
        409,
        "SCHEDULE_CONFLICT"
      );
    }

    const session = this.factory.createSession(dto);
    const saved = await this.sessionRepo.save(session);

    await this.eventBus.publish(
      new DoctorSessionCreated({
        sessionId: saved.sessionId,
        actorId: actor.id,
      })
    );

    return saved;
  }

  // ============================================================
  // UPDATE SESSION
  // ============================================================
  async editSchedule(dto, actor) {
    if (!dto.sessionId) {
      throw new ValidationError("Session ID is required");
    }

    const updated = await this.sessionRepo.update(
      this.factory.createSession(dto)
    );

    if (!updated) {
      throw new AppError("Session not found", 404, "SESSION_NOT_FOUND");
    }

    await this.eventBus.publish(
      new DoctorSessionUpdated({
        sessionId: dto.sessionId,
        actorId: actor.id,
      })
    );

    return updated;
  }

  // ============================================================
  // DELETE SESSION
  // ============================================================
  async deleteSchedule(sessionId, actor) {
    if (!sessionId) {
      throw new ValidationError("Session ID is required");
    }

    await this.sessionRepo.delete(sessionId);

    await this.eventBus.publish(
      new DoctorSessionDeleted({
        sessionId,
        actorId: actor.id,
      })
    );

    return true;
  }

  // ============================================================
  // QUERIES
  // ============================================================
  async getDoctorSessions(doctorId) {
    if (!doctorId) {
      throw new ValidationError("Doctor ID is required");
    }

    return this.sessionRepo.findByDoctor(doctorId);
  }

  async checkConflicts(dto) {
    return this.sessionRepo.findConflicts(
      dto.doctorId,
      dto.clinicId,
      dto.dayOfWeek,
      dto.startTime,
      dto.endTime
    );
  }
}
