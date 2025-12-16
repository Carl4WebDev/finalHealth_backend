import AppError from "../../../../core/errors/AppError.js";
import ValidationError from "../../../../core/errors/ValidationError.js";

import ClinicRegistered from "../../domain/events/clinics/ClinicRegistered.js";
import ClinicApproved from "../../domain/events/clinics/ClinicApproved.js";
import ClinicRejected from "../../domain/events/clinics/ClinicRejected.js";

export default class ClinicManagementService {
  constructor(clinicRepo, factory, eventBus) {
    this.clinicRepo = clinicRepo;
    this.factory = factory;
    this.eventBus = eventBus;
  }

  // ============================================================
  // REGISTER CLINIC
  // ============================================================
  async registerClinic(dto, actor) {
    if (!actor?.id || !actor?.role) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const clinic = this.factory.createClinic(dto);
    const saved = await this.clinicRepo.save(clinic);

    await this.eventBus.publish(
      new ClinicRegistered({
        clinicId: saved.clinicId,
        actorId: actor.id,
        actorRole: actor.role,
      })
    );

    return saved;
  }

  // ============================================================
  // APPROVE CLINIC
  // ============================================================
  async approveClinic(clinicId, actor) {
    if (!clinicId) {
      throw new ValidationError("Clinic ID is required");
    }

    if (actor.role !== "ADMIN") {
      throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    const updated = await this.clinicRepo.updateVerificationStatus(
      clinicId,
      "Approved"
    );

    if (!updated) {
      throw new AppError("Clinic not found", 404, "CLINIC_NOT_FOUND");
    }
    console.log("ACTOR IN SERVICE:", actor);

    await this.eventBus.publish(
      new ClinicApproved({
        clinicId,
        actorId: actor.id,
      })
    );

    return updated;
  }

  // ============================================================
  // REJECT CLINIC
  // ============================================================
  async rejectClinic(clinicId, admin, reason) {
    if (!reason) {
      throw new ValidationError("Rejection reason is required");
    }

    if (admin.role !== "ADMIN") {
      throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    const updated = await this.clinicRepo.updateVerificationStatus(
      clinicId,
      "Rejected"
    );

    if (!updated) {
      throw new AppError("Clinic not found", 404, "CLINIC_NOT_FOUND");
    }

    await this.eventBus.publish(
      new ClinicRejected({
        clinicId,
        adminId: admin.adminId || admin.id,
        reason,
      })
    );

    return updated;
  }

  // ============================================================
  // QUERIES
  // ============================================================
  async getClinicById(clinicId) {
    const clinic = await this.clinicRepo.findById(clinicId);
    if (!clinic) {
      throw new AppError("Clinic not found", 404, "CLINIC_NOT_FOUND");
    }
    return clinic;
  }

  async getPendingClinics() {
    return await this.clinicRepo.findPendingVerification();
  }
}
