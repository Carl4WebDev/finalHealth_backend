import AppError from "../../../../core/errors/AppError.js";
import ValidationError from "../../../../core/errors/ValidationError.js";

import PatientRegistered from "../../domain/events/patients/PatientRegistered.js";
import PatientUpdated from "../../domain/events/patients/PatientUpdated.js";

export default class PatientManagementService {
  constructor(patientRepo, factory, eventBus) {
    this.patientRepo = patientRepo;
    this.factory = factory;
    this.eventBus = eventBus;
  }

  // ============================================================
  // REGISTER PATIENT
  // ============================================================
  async createPatient(dto, actor) {
    if (!actor?.id || !actor?.role) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    if (dto.email) {
      const exists = await this.patientRepo.findByEmail(dto.email);
      if (exists) {
        throw new AppError("Patient already exists", 409, "PATIENT_EXISTS");
      }
    }

    // const patient = this.factory.createPatient(dto);
    const saved = await this.patientRepo.createPatient(dto);

    await this.eventBus.publish(
      new PatientRegistered({
        patientId: saved.patientId,
        actorId: actor.id,
        actorRole: actor.role,
      })
    );

    return saved;
  }

  // ============================================================
  // UPDATE PATIENT
  // ============================================================
  // async updatePatient(patientId, dto, actor) {
  //   if (!actor?.id) {
  //     throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  //   }

  //   const existing = await this.patientRepo.findById(patientId);
  //   if (!existing) {
  //     throw new AppError("Patient not found", 404, "PATIENT_NOT_FOUND");
  //   }

  //   const updated = existing
  //     .toBuilder()
  //     .setFName(dto.fName ?? existing.fName)
  //     .setMName(dto.mName ?? existing.mName)
  //     .setLName(dto.lName ?? existing.lName)
  //     .setGender(dto.gender ?? existing.gender)
  //     .setDateOfBirth(dto.dateOfBirth ?? existing.dateOfBirth)
  //     .setContactNumber(dto.contactNumber ?? existing.contactNumber)
  //     .setBackupContact(dto.backupContact ?? existing.backupContact)
  //     .setEmail(dto.email ?? existing.email)
  //     .setAddress(dto.address ?? existing.address)
  //     .setPatientTypeId(dto.patientTypeId ?? existing.patientTypeId)
  //     .build();

  //   const saved = await this.patientRepo.update(updated);

  //   await this.eventBus.publish(
  //     new PatientUpdated({
  //       patientId: saved.patientId,
  //       actorId: actor.id,
  //     })
  //   );

  //   return saved;
  // }

  // services/PatientService.js
  async updatePatient(patientId, payload, actor) {
    if (!actor?.id || !actor?.role) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    if (!patientId) {
      throw new AppError("Patient ID required", 400, "INVALID_PATIENT");
    }

    if (Object.keys(payload).length === 0) {
      throw new AppError("No fields to update", 400, "EMPTY_UPDATE");
    }

    const updated = await this.patientRepo.updatePatient(patientId, payload);

    if (!updated) {
      throw new AppError("Patient not found", 404, "PATIENT_NOT_FOUND");
    }

    // Optional audit/event later
    // await this.eventBus.publish(new PatientUpdated(...))

    return updated;
  }

  // ============================================================
  // QUERIES
  // ============================================================
  async getPatientById(patientId) {
    const patient = await this.patientRepo.findById(patientId);
    if (!patient) {
      throw new AppError("Patient not found", 404, "PATIENT_NOT_FOUND");
    }
    return patient;
  }

  async searchPatients(term) {
    return this.patientRepo.search(term);
  }

  async getPatientOfDoctorInClinic(doctorId, clinicId) {
    return this.patientRepo.getPatientOfDoctorInClinic(doctorId, clinicId);
  }
}
