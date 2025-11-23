export default class ClinicManagementService {
  constructor(clinicRepo, factory) {
    this.clinicRepo = clinicRepo;
    this.factory = factory;
  }

  async registerClinic(dto) {
    const clinic = this.factory.createClinic(dto);
    const saved = await this.clinicRepo.save(clinic);
    return saved;
  }

  async submitForVerification(clinicId) {
    return this.clinicRepo.updateVerificationStatus(clinicId, "Pending");
  }

  async approveClinic(clinicId, adminId) {
    // adminId can be used in Audit subsystem
    return this.clinicRepo.updateVerificationStatus(clinicId, "Approved");
  }

  async rejectClinic(clinicId, adminId, reason) {
    return this.clinicRepo.updateVerificationStatus(clinicId, "Rejected");
  }

  async getClinicById(clinicId) {
    return await this.clinicRepo.findById(clinicId);
  }

  async getPendingClinics() {
    return await this.clinicRepo.findPendingVerification();
  }
}
