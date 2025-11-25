import QueueEntry from "../../domain/entities/QueueEntry.js";

export default class QueueService {
  constructor(queueRepo, priorityRepo, auditService) {
    this.queueRepo = queueRepo;
    this.priorityRepo = priorityRepo;
    this.auditService = auditService;
  }
  // Service method to add a patient to the queue
  async addToQueue(dto, actor) {
    // Check if the patient is already in the queue for the same doctor and clinic
    const existingQueue =
      await this.queueRepo.findQueueByPatientAndDoctorAndClinic(
        dto.patientId,
        dto.doctorId,
        dto.clinicId
      );

    if (existingQueue.length > 0) {
      throw new Error(
        "Patient is already in the queue for this doctor and clinic."
      );
    }

    // Fetch the priority data to validate the priority
    const priority = await this.priorityRepo.findById(dto.priorityId);
    if (!priority) {
      throw new Error("Invalid priority ID provided.");
    }

    // Map the patient priority type from the provided priorityId
    const priorityLevel = priority.priority_level;

    // Create a new queue entry
    const queueEntry = new QueueEntry.Builder()
      .setPatientId(dto.patientId)
      .setDoctorId(dto.doctorId)
      .setClinicId(dto.clinicId)
      .setPriorityId(dto.priorityId)
      .setStatus(dto.status)
      .build();

    // Add the queue entry to the database
    const saved = await this.queueRepo.addToQueue(queueEntry);

    // Log the action in the audit service
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "QUEUE_ADD",
      tableAffected: "queue_entries",
      recordId: saved.queueEntryId,
      details: JSON.stringify(dto),
    });

    return saved;
  }

  async listQueue(doctorId, clinicId) {
    return await this.queueRepo.listQueue(doctorId, clinicId);
  }

  async updateStatus(queueEntryId, status, actor) {
    const updated = await this.queueRepo.updateStatus(queueEntryId, status);

    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: `QUEUE_${status.toUpperCase()}`,
      tableAffected: "queue_entries",
      recordId: queueEntryId,
      details: status,
    });

    return updated;
  }
}
