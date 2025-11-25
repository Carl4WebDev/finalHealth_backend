export default class DoctorManagementService {
  constructor(doctorRepo, clinicRepo, factory, auditService) {
    this.doctorRepo = doctorRepo;
    this.clinicRepo = clinicRepo;
    this.factory = factory;
    this.auditService = auditService; // NEW
  }

  async registerDoctor(dto, actor) {
    const doctor = this.factory.createDoctor(dto);
    const saved = await this.doctorRepo.save(doctor);

    // AUDIT LOG (REQ040)
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "DOCTOR_REGISTERED",
      tableAffected: "doctor",
      recordId: saved.doctorId,
      details: JSON.stringify(dto),
    });

    return saved;
  }

  async approveDoctor(doctorId, actor) {
    const updated = await this.doctorRepo.updateVerificationStatus(
      doctorId,
      "Approved"
    );

    // AUDIT LOG
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "DOCTOR_APPROVED",
      tableAffected: "doctor",
      recordId: doctorId,
      details: `Doctor approved by admin`,
    });

    return updated;
  }

  async rejectDoctor(doctorId, actor, reason) {
    const updated = await this.doctorRepo.updateVerificationStatus(
      doctorId,
      "Rejected"
    );

    // AUDIT LOG
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "DOCTOR_REJECTED",
      tableAffected: "doctor",
      recordId: doctorId,
      details: reason,
    });

    return updated;
  }

  async assignDoctorToClinic(doctorId, clinicId, actor) {
    const clinic = await this.clinicRepo.findById(clinicId);
    if (!clinic) throw new Error("Clinic not found");

    const updated = await this.doctorRepo.assignToClinic(doctorId, clinicId);

    // AUDIT LOG
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "DOCTOR_ASSIGNED_TO_CLINIC",
      tableAffected: "clinic_doctor",
      recordId: doctorId,
      details: `Assigned doctor ${doctorId} to clinic ${clinicId}`,
    });

    return updated;
  }

  async getDoctors(clinicId = null) {
    if (clinicId) {
      return await this.doctorRepo.findByClinic(clinicId);
    }
    return await this.doctorRepo.findAll();
  }
  async getClinicsOfDoctor(doctorId) {
    return await this.clinicRepo.findClinicsByDoctor(doctorId);
  }
}
