import AppError from "../../../../core/errors/AppError.js";
import ValidationError from "../../../../core/errors/ValidationError.js";

import DoctorRegistered from "../../domain/events/doctors/DoctorRegistered.js";
import DoctorApproved from "../../domain/events/doctors/DoctorApproved.js";
import DoctorRejected from "../../domain/events/doctors/DoctorRejected.js";
import DoctorAssignedToClinic from "../../domain/events/doctors/DoctorAssignedToClinic.js";

import SubscriptionLimitService from "../../../../core/subscription/SubscriptionLimitService.js";

export default class DoctorManagementService {
  constructor(doctorRepo, clinicRepo, factory, eventBus) {
    this.doctorRepo = doctorRepo;
    this.clinicRepo = clinicRepo;
    this.factory = factory;
    this.eventBus = eventBus;
  }

  // ============================================================
  // REGISTER DOCTOR
  // ============================================================
  async registerDoctor(dto, actor) {
    console.log("REGISTER DOCTOR DTO:", dto);
    console.log("REGISTER DOCTOR ACTOR:", actor);

    if (!actor?.id || !actor?.role) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const snapshot = await SubscriptionLimitService.getPlanSnapshot(actor.id);
    console.log("PLAN SNAPSHOT:", snapshot);

    const currentDoctors = await this.doctorRepo.countByUser(actor.id);
    console.log("CURRENT DOCTORS:", currentDoctors);

    await SubscriptionLimitService.enforceDoctorLimit(actor.id);

    const doctor = this.factory.createDoctor(dto);
    console.log("DOCTOR ENTITY:", doctor);

    const saved = await this.doctorRepo.save(doctor, actor.id);
    console.log("SAVED DOCTOR:", saved);

    await this.eventBus.publish(
      new DoctorRegistered({
        doctorId: saved.doctorId,
        actorId: actor.id,
        actorRole: actor.role,
      }),
    );

    return saved;
  }

  // ============================================================
  // APPROVE DOCTOR (ADMIN)
  // ============================================================
  async approveDoctor(doctorId, actor) {
    if (actor.role !== "ADMIN") {
      throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    const updated = await this.doctorRepo.updateVerificationStatus(
      doctorId,
      "Approved",
    );

    if (!updated) {
      throw new AppError("Doctor not found", 404, "DOCTOR_NOT_FOUND");
    }

    await this.eventBus.publish(
      new DoctorApproved({
        doctorId,
        actorId: actor.id,
      }),
    );

    return updated;
  }

  // ============================================================
  // REJECT DOCTOR (ADMIN)
  // ============================================================
  async rejectDoctor(doctorId, actor, reason) {
    if (!reason) {
      throw new ValidationError("Rejection reason is required");
    }

    const updated = await this.doctorRepo.updateVerificationStatus(
      doctorId,
      "Rejected",
    );

    if (!updated) {
      throw new AppError("Doctor not found", 404, "DOCTOR_NOT_FOUND");
    }

    await this.eventBus.publish(
      new DoctorRejected({
        doctorId,
        actorId: actor.id,
        reason,
      }),
    );

    return updated;
  }

  // ============================================================
  // ASSIGN DOCTOR TO CLINIC
  // ============================================================
  async assignDoctorToClinic(doctorId, clinicId, actor) {
    const clinic = await this.clinicRepo.findById(clinicId);
    if (!clinic) {
      throw new AppError("Clinic not found", 404, "CLINIC_NOT_FOUND");
    }

    await this.doctorRepo.assignToClinic(doctorId, clinicId);

    await this.eventBus.publish(
      new DoctorAssignedToClinic({
        doctorId,
        clinicId,
        actorId: actor.id,
      }),
    );
  }

  // ============================================================
  // QUERIES
  // ============================================================
  async getDoctors(clinicId = null) {
    if (clinicId) {
      return this.doctorRepo.findByClinic(clinicId);
    }
    return this.doctorRepo.findAll();
  }

  async getClinicsOfDoctor(doctorId) {
    return this.clinicRepo.findClinicsByDoctor(doctorId);
  }

  // ============================================================
  // New & Planned api calls
  // ============================================================

  async getAllApprovedDoctorsOfUser(userId) {
    return this.doctorRepo.getAllApprovedDoctorsOfUser(userId);
  }
  async getAllDoctorsOfUser(userId) {
    return this.doctorRepo.getAllDoctorsOfUser(userId);
  }
  async getAllInfoOfDoctor(doctorId, userId) {
    return this.doctorRepo.getAllInfoOfDoctor(doctorId, userId);
  }
  async updateDoctorInfo(doctorId, doctorData) {
    return this.doctorRepo.updateDoctorInfo(doctorId, doctorData);
  }
}
