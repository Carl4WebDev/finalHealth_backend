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
    // Ensure the appointment date is not in the past
    const appointmentDate = new Date(dto.appointmentDate);
    const currentDate = new Date();

    if (appointmentDate < currentDate) {
      throw new Error("Appointment cannot be booked in the past");
    }

    // Find the patient
    const patient = await this.patientRepo.findById(dto.patientId);
    if (!patient) throw new Error("Patient not found");

    // Validate the priority level
    const priority = await this.priorityRepo.findById(dto.priorityId);
    if (!priority) throw new Error("Priority not found");

    // Check for any conflicts (e.g., double-booking)
    const conflicts = await this.appointmentRepo.checkDoubleBooking(
      dto.patientId,
      dto.appointmentDate
    );
    if (conflicts.length > 0) {
      throw new Error("Patient already has an appointment on this date");
    }

    // Create the appointment
    const appointment = this.factory.createAppointment(dto);
    const saved = await this.appointmentRepo.save(appointment);

    // Record the action in the audit log
    await this.auditService.record({
      actorId: actor.id, // Actor refers to the user who created the appointment
      actorType: actor.role, // Actor's role (e.g., admin, secretary, etc.)
      action: "APPOINTMENT_CREATED",
      tableAffected: "appointment",
      recordId: saved.appointmentId,
      details: JSON.stringify(dto), // Store the appointment details
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

  async cancelAppointment(appointmentId, actor) {
    const existing = await this.appointmentRepo.findById(appointmentId);
    if (!existing) throw new Error("Appointment not found");

    if (existing.status === "Completed" || existing.status === "Cancelled") {
      throw new Error(
        "This appointment cannot be cancelled, as it is already completed or cancelled."
      );
    }

    existing.status = "Cancelled"; // Update status to cancelled
    const updated = await this.appointmentRepo.update(existing);

    // AUDIT LOG
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "APPOINTMENT_CANCELLED",
      tableAffected: "appointment",
      recordId: appointmentId,
      details: "Appointment cancelled by user", // No reason
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

  async listAllAppointmentsByDoctorAndClinic(doctorId, clinicId) {
    return await this.appointmentRepo.findAllByDoctorAndClinic(
      doctorId,
      clinicId
    );
  }

  async listTodayAppointments(doctorId, clinicId) {
    return await this.appointmentRepo.findTodayAppointments(doctorId, clinicId);
  }
}
