import AppError from "../../../../core/errors/AppError.js";
import ValidationError from "../../../../core/errors/ValidationError.js";

import ClinicRegistered from "../../domain/events/clinics/ClinicRegistered.js";
import ClinicApproved from "../../domain/events/clinics/ClinicApproved.js";
import ClinicRejected from "../../domain/events/clinics/ClinicRejected.js";

import db from "../../../../core/database/db.js";

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
    const saved = await this.clinicRepo.save(clinic, actor.id);

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

  // ============================================================
  // New & Planned api calls
  // ============================================================
  async getAllClinicsOfDoctor(doctorId, userId) {
    return await this.clinicRepo.getAllClinicsOfDoctor(doctorId, userId);
  }
  async getAllClinicsOfUserNotAffiliated(doctorId, userId) {
    return await this.clinicRepo.getAllClinicsOfUserNotAffiliated(
      doctorId,
      userId
    );
  }
  async getClinicSessions(clinicId) {
    return await this.clinicRepo.getClinicSessions(clinicId);
  }

  async createAffiliationDoctorToClinic(doctorId, clinicId) {
    return await this.clinicRepo.createAffiliationDoctorToClinic(
      doctorId,
      clinicId
    );
  }
  async createClinicSession(clinicId, clinicSessionData) {
    return await this.clinicRepo.createClinicSession(
      clinicId,
      clinicSessionData
    );
  }

  async deleteClinicAffiliation(doctorId, clinicId) {
    await db.transaction(async (trx) => {
      await this.clinicRepo.cancelByDoctorAndClinic(doctorId, clinicId, trx);

      await this.clinicRepo.deleteByDoctorAndClinic(doctorId, clinicId, trx);

      await this.clinicRepo.delete(doctorId, clinicId, trx);
    });
  }
  async deleteClinicSession(sessionId) {
    await db.transaction(async (trx) => {
      // 1. Get clinic session
      const session = await this.clinicRepo.getClinicSessionById(
        sessionId,
        trx
      );

      if (!session) {
        throw new AppError(
          "Clinic session not found",
          404,
          "SESSION_NOT_FOUND"
        );
      }

      // 2. Cancel future appointments of this clinic
      await this.clinicRepo.cancelAppointmentsByClinic(session, trx);

      // 3. Delete doctor sessions tied to this clinic + day
      await this.clinicRepo.deleteDoctorSessionsByClinicSchedule(session, trx);

      // 4. Delete clinic session itself
      await this.clinicRepo.deleteClinicSessionById(sessionId, trx);
    });
  }
}
