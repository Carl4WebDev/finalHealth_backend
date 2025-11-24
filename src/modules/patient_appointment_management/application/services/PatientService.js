export default class PatientService {
  constructor(patientRepo, factory, auditService) {
    this.patientRepo = patientRepo;
    this.factory = factory;
    this.auditService = auditService; // NEW
  }

  async registerPatient(dto, actor) {
    const patient = this.factory.createPatient(dto);
    const saved = await this.patientRepo.save(patient);

    // AUDIT LOG
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "PATIENT_REGISTERED",
      tableAffected: "patient",
      recordId: saved.patientId,
      details: JSON.stringify(dto),
    });

    return saved;
  }

  async getPatientById(id) {
    return await this.patientRepo.findById(id);
  }

  async searchPatients(term) {
    return await this.patientRepo.findBySearch(term);
  }

  async updatePatient(dto, actor) {
    const existing = await this.patientRepo.findById(dto.patientId);
    if (!existing) throw new Error("Patient not found");

    const updated = existing
      .toBuilder()
      .setFName(dto.fName ?? existing.fName)
      .setMName(dto.mName ?? existing.mName)
      .setLName(dto.lName ?? existing.lName)
      .setGender(dto.gender ?? existing.gender)
      .setDateOfBirth(dto.dateOfBirth ?? existing.dateOfBirth)
      .setContactNumber(dto.contactNumber ?? existing.contactNumber)
      .setBackupContact(dto.backupContact ?? existing.backupContact)
      .setEmail(dto.email ?? existing.email)
      .setAddress(dto.address ?? existing.address)
      .setPatientTypeId(dto.patientTypeId ?? existing.patientTypeId)
      .build();

    const saved = await this.patientRepo.update(updated);

    // AUDIT LOG
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "PATIENT_UPDATED",
      tableAffected: "patient",
      recordId: dto.patientId,
      details: JSON.stringify(dto),
    });

    return saved;
  }
}
