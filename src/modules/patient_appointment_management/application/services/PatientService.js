export default class PatientService {
  constructor(patientRepo, factory) {
    this.patientRepo = patientRepo;
    this.factory = factory;
  }

  async registerPatient(dto) {
    const patient = this.factory.createPatient(dto);
    return await this.patientRepo.save(patient);
  }

  async getPatientById(id) {
    return await this.patientRepo.findById(id);
  }

  async searchPatients(term) {
    return await this.patientRepo.findBySearch(term);
  }

  async updatePatient(dto) {
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

    return await this.patientRepo.update(updated);
  }
}
