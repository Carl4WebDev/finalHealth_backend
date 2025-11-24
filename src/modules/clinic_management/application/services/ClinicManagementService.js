export default class ClinicManagementService {
  constructor(clinicRepo, factory, auditService) {
    this.clinicRepo = clinicRepo;
    this.factory = factory;
    this.auditService = auditService; // NEW
  }

  async registerClinic(dto, actor) {
    const clinic = this.factory.createClinic(dto);
    const saved = await this.clinicRepo.save(clinic);

    // AUDIT LOG — REQ040
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "CLINIC_REGISTERED",
      tableAffected: "clinic",
      recordId: saved.clinicId,
      details: JSON.stringify(dto),
    });

    return saved;
  }

  async submitForVerification(clinicId, actor) {
    const updated = await this.clinicRepo.updateVerificationStatus(
      clinicId,
      "Pending"
    );

    // AUDIT LOG — REQ040
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "CLINIC_SUBMITTED_FOR_VERIFICATION",
      tableAffected: "clinic",
      recordId: clinicId,
      details: `Clinic submitted for review`,
    });

    return updated;
  }

  async approveClinic(clinicId, admin) {
    const updated = await this.clinicRepo.updateVerificationStatus(
      clinicId,
      "Approved"
    );

    // AUDIT LOG — REQ040
    await this.auditService.record({
      actorId: admin.adminId || admin.id,
      actorType: "ADMIN",
      action: "CLINIC_APPROVED",
      tableAffected: "clinic",
      recordId: clinicId,
      details: `Clinic approved by admin`,
    });

    return updated;
  }

  async rejectClinic(clinicId, admin, reason) {
    const updated = await this.clinicRepo.updateVerificationStatus(
      clinicId,
      "Rejected"
    );

    // AUDIT LOG — REQ040
    await this.auditService.record({
      actorId: admin.adminId || admin.id,
      actorType: "ADMIN",
      action: "CLINIC_REJECTED",
      tableAffected: "clinic",
      recordId: clinicId,
      details: reason,
    });

    return updated;
  }

  async getClinicById(clinicId) {
    return await this.clinicRepo.findById(clinicId);
  }

  async getPendingClinics() {
    return await this.clinicRepo.findPendingVerification();
  }
}
