import AppError from "../../../../core/errors/AppError.js";
import QueueEntry from "../../domain/entities/QueueEntry.js";

import QueueAdded from "../../domain/events/queues/QueueAdded.js";
import QueueStatusUpdated from "../../domain/events/queues/QueueStatusUpdated.js";

export default class QueueService {
  constructor(queueRepo, priorityRepo, eventBus) {
    this.queueRepo = queueRepo;
    this.priorityRepo = priorityRepo;
    this.eventBus = eventBus;
  }

  async addToQueue(dto, actor) {
    const existingQueue =
      await this.queueRepo.findQueueByPatientAndDoctorAndClinic(
        dto.patientId,
        dto.doctorId,
        dto.clinicId
      );

    if (existingQueue.length > 0) {
      throw new AppError(
        "Patient is already in the queue for this doctor and clinic",
        409,
        "QUEUE_CONFLICT"
      );
    }

    const priority = await this.priorityRepo.findById(dto.priorityId);
    if (!priority) {
      throw new AppError(
        "Invalid priority ID provided",
        400,
        "INVALID_PRIORITY"
      );
    }

    const queueEntry = new QueueEntry.Builder()
      .setPatientId(dto.patientId)
      .setDoctorId(dto.doctorId)
      .setClinicId(dto.clinicId)
      .setPriorityId(dto.priorityId)
      .setStatus(dto.status)
      .build();

    const saved = await this.queueRepo.addToQueue(queueEntry);

    await this.eventBus.publish(
      new QueueAdded({
        queueEntryId: saved.queueEntryId,
        actorId: actor.id,
        actorRole: actor.role,
      })
    );

    return saved;
  }

  async listQueue(doctorId, clinicId) {
    return this.queueRepo.listQueue(doctorId, clinicId);
  }

  async updateStatus(queueEntryId, status, actor) {
    const updated = await this.queueRepo.updateStatus(queueEntryId, status);

    if (!updated) {
      throw new AppError("Queue entry not found", 404, "QUEUE_ENTRY_NOT_FOUND");
    }

    await this.eventBus.publish(
      new QueueStatusUpdated({
        queueEntryId,
        status,
        actorId: actor.id,
      })
    );

    return updated;
  }
}
