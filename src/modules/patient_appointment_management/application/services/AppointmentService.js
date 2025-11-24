export default class AppointmentService {
  constructor(
    appointmentRepo,
    patientRepo,
    priorityRepo,
    factory,
    auditService
  ) {
    this.appointmentRepo = appointmentRepo;
    this.patientRepo = patientRepo;
    this.priorityRepo = priorityRepo;
    this.factory = factory;
    this.auditService = auditService; // NEW
  }

  async createAppointment(dto, actor) {
    const patient = await this.patientRepo.findById(dto.patientId);
    if (!patient) throw new Error("Patient not found");

    const priority = await this.priorityRepo.findById(dto.priorityId);
    if (!priority) throw new Error("Priority not found");

    const conflicts = await this.appointmentRepo.checkDoubleBooking(
      dto.patientId,
      dto.appointmentDate
    );
    if (conflicts.length > 0)
      throw new Error("Patient already has an appointment on this date");

    const appointment = this.factory.createAppointment(dto);
    const saved = await this.appointmentRepo.save(appointment);

    // AUDIT LOG
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "APPOINTMENT_CREATED",
      tableAffected: "appointment",
      recordId: saved.appointmentId,
      details: JSON.stringify(dto),
    });

    return saved;
  }

  async rescheduleAppointment(dto, actor) {
    const existing = await this.appointmentRepo.findById(dto.appointmentId);
    if (!existing) throw new Error("Appointment not found");

    const conflicts = await this.appointmentRepo.checkDoubleBooking(
      existing.patientId,
      dto.appointmentDate
    );
    if (conflicts.some((a) => a.appointmentId !== existing.appointmentId))
      throw new Error("Patient already has an appointment on this date");

    const updated = existing
      .toBuilder()
      .setAppointmentDate(dto.appointmentDate)
      .setAppointmentType(dto.appointmentType ?? existing.appointmentType)
      .setPriorityId(dto.priorityId ?? existing.priorityId)
      .build();

    const result = await this.appointmentRepo.update(updated);

    // AUDIT LOG
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "APPOINTMENT_RESCHEDULED",
      tableAffected: "appointment",
      recordId: dto.appointmentId,
      details: JSON.stringify(dto),
    });

    return result;
  }

  async cancelAppointment(appointmentId, reason, actor) {
    const existing = await this.appointmentRepo.findById(appointmentId);
    if (!existing) throw new Error("Appointment not found");

    existing.cancel(reason);
    const updated = await this.appointmentRepo.update(existing);

    // AUDIT LOG
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "APPOINTMENT_CANCELLED",
      tableAffected: "appointment",
      recordId: appointmentId,
      details: reason,
    });

    return updated;
  }

  async completeAppointment(appointmentId, actor) {
    const existing = await this.appointmentRepo.findById(appointmentId);
    if (!existing) throw new Error("Appointment not found");

    existing.markCompleted();
    const updated = await this.appointmentRepo.update(existing);

    // AUDIT LOG
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "APPOINTMENT_COMPLETED",
      tableAffected: "appointment",
      recordId: appointmentId,
      details: `Appointment ${appointmentId} marked completed`,
    });

    return updated;
  }

  async listAppointmentsByDateRange(clinicId, fromDate, toDate) {
    return await this.appointmentRepo.findByDateRange(
      clinicId,
      fromDate,
      toDate
    );
  }

  async listAppointmentsByPatient(patientId) {
    return await this.appointmentRepo.findByPatient(patientId);
  }

  async getAppointmentById(id) {
    return await this.appointmentRepo.findById(id);
  }
}
