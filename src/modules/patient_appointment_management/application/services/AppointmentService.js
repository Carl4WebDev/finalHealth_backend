export default class AppointmentService {
  constructor(appointmentRepo, patientRepo, priorityRepo, factory) {
    this.appointmentRepo = appointmentRepo;
    this.patientRepo = patientRepo;
    this.priorityRepo = priorityRepo;
    this.factory = factory;
  }

  async createAppointment(dto) {
    // check patient exists
    const patient = await this.patientRepo.findById(dto.patientId);
    if (!patient) throw new Error("Patient not found");

    // check priority exists
    const priority = await this.priorityRepo.findById(dto.priorityId);
    if (!priority) throw new Error("Priority not found");

    // check double booking (per requirements)
    const conflicts = await this.appointmentRepo.checkDoubleBooking(
      dto.patientId,
      dto.appointmentDate
    );
    if (conflicts.length > 0) {
      throw new Error("Patient already has an appointment on this date");
    }

    const appointment = this.factory.createAppointment(dto);
    return await this.appointmentRepo.save(appointment);
  }

  async rescheduleAppointment(dto) {
    const existing = await this.appointmentRepo.findById(dto.appointmentId);
    if (!existing) throw new Error("Appointment not found");

    // avoid double booking on new date
    const conflicts = await this.appointmentRepo.checkDoubleBooking(
      existing.patientId,
      dto.appointmentDate
    );
    if (conflicts.some((a) => a.appointmentId !== existing.appointmentId)) {
      throw new Error("Patient already has an appointment on this date");
    }

    const updated = existing
      .toBuilder()
      .setAppointmentDate(dto.appointmentDate)
      .setAppointmentType(dto.appointmentType ?? existing.appointmentType)
      .setPriorityId(dto.priorityId ?? existing.priorityId)
      .build();

    return await this.appointmentRepo.update(updated);
  }

  async cancelAppointment(appointmentId, reason) {
    const existing = await this.appointmentRepo.findById(appointmentId);
    if (!existing) throw new Error("Appointment not found");

    existing.cancel(reason);
    return await this.appointmentRepo.update(existing);
  }

  async completeAppointment(appointmentId) {
    const existing = await this.appointmentRepo.findById(appointmentId);
    if (!existing) throw new Error("Appointment not found");

    existing.markCompleted();
    return await this.appointmentRepo.update(existing);
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
