import AppError from "../../../../core/errors/AppError.js";

import AppointmentCreated from "../../domain/events/appointments/AppointmentCreated.js";
import AppointmentRescheduled from "../../domain/events/appointments/AppointmentRescheduled.js";
import AppointmentCancelled from "../../domain/events/appointments/AppointmentCancelled.js";
import AppointmentCompleted from "../../domain/events/appointments/AppointmentCompleted.js";

export default class AppointmentService {
  constructor(
    appointmentRepo,
    patientRepo,
    priorityRepo,
    doctorSessionRepo,
    factory,
    eventBus
  ) {
    this.appointmentRepo = appointmentRepo;
    this.patientRepo = patientRepo;
    this.priorityRepo = priorityRepo;
    this.doctorSessionRepo = doctorSessionRepo;
    this.factory = factory;
    this.eventBus = eventBus; // ✅ STANDARD
  }

  async createAppointment(dto, actor) {
    const appointmentDate = new Date(dto.appointmentDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (appointmentDate < currentDate) {
      throw new AppError(
        "Appointment cannot be booked in the past",
        400,
        "INVALID_APPOINTMENT_DATE"
      );
    }

    const patientConflicts = await this.appointmentRepo.checkDoubleBooking(
      dto.patientId,
      dto.appointmentDate
    );

    if (patientConflicts.length > 0) {
      throw new AppError(
        "Patient already has an appointment on this date",
        409,
        "APPOINTMENT_CONFLICT"
      );
    }

    const appointment = this.factory.createAppointment(dto);
    const saved = await this.appointmentRepo.save(appointment);

    await this.eventBus.publish(
      new AppointmentCreated({
        appointmentId: saved.appointmentId,
        actorId: actor.id,
        actorRole: actor.role,
      })
    );

    return saved;
  }

  async rescheduleAppointment(dto, actor) {
    const existing = await this.appointmentRepo.findById(dto.appointmentId);
    if (!existing) {
      throw new AppError("Appointment not found", 404, "APPOINTMENT_NOT_FOUND");
    }

    const conflicts = await this.appointmentRepo.checkDoubleBooking(
      existing.patientId,
      dto.appointmentDate
    );

    if (conflicts.some((a) => a.appointmentId !== existing.appointmentId)) {
      throw new AppError(
        "Patient already has an appointment on this date",
        409,
        "APPOINTMENT_CONFLICT"
      );
    }

    const updated = existing
      .toBuilder()
      .setAppointmentDate(dto.appointmentDate)
      .setAppointmentType(dto.appointmentType ?? existing.appointmentType)
      .setPriorityId(dto.priorityId ?? existing.priorityId)
      .build();

    const result = await this.appointmentRepo.update(updated);

    await this.eventBus.publish(
      new AppointmentRescheduled({
        appointmentId: dto.appointmentId,
        actorId: actor.id,
      })
    );

    return result;
  }

  async cancelAppointment(appointmentId, actor) {
    const existing = await this.appointmentRepo.findById(appointmentId);
    if (!existing) {
      throw new AppError("Appointment not found", 404, "APPOINTMENT_NOT_FOUND");
    }

    if (existing.status === "Completed" || existing.status === "Cancelled") {
      throw new AppError(
        "Appointment cannot be cancelled in its current state",
        400,
        "INVALID_APPOINTMENT_STATE"
      );
    }

    existing.status = "Cancelled";
    const updated = await this.appointmentRepo.update(existing);

    await this.eventBus.publish(
      new AppointmentCancelled({
        appointmentId,
        actorId: actor.id,
      })
    );

    return updated;
  }

  async completeAppointment(appointmentId, actor) {
    const existing = await this.appointmentRepo.findById(appointmentId);
    if (!existing) {
      throw new AppError("Appointment not found", 404, "APPOINTMENT_NOT_FOUND");
    }

    existing.markCompleted();
    const updated = await this.appointmentRepo.update(existing);

    await this.eventBus.publish(
      new AppointmentCompleted({
        appointmentId,
        actorId: actor.id,
      })
    );

    return updated;
  }

  async listAppointmentsByDateRange(clinicId, fromDate, toDate) {
    return this.appointmentRepo.findByDateRange(clinicId, fromDate, toDate);
  }

  async listAppointmentsByPatient(patientId) {
    return this.appointmentRepo.findByPatient(patientId);
  }

  async getAppointmentById(id) {
    const appointment = await this.appointmentRepo.findById(id);
    if (!appointment) {
      throw new AppError("Appointment not found", 404, "APPOINTMENT_NOT_FOUND");
    }
    return appointment;
  }

  async listAllAppointmentsByDoctorAndClinic(doctorId, clinicId) {
    return this.appointmentRepo.findAllByDoctorAndClinic(doctorId, clinicId);
  }

  async listTodayAppointments(doctorId, clinicId) {
    return this.appointmentRepo.findTodayAppointments(doctorId, clinicId);
  }

  // ============================================================
  // New & Planned api calls
  // ============================================================
  async getAllAppointmentsOfDoctorInClinic(doctorId, clinicId) {
    return this.appointmentRepo.getAllAppointmentsOfDoctorInClinic(
      doctorId,
      clinicId
    );
  }
}
