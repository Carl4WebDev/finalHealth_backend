export default class DoctorManagementService {
  constructor(doctorRepo, clinicRepo, factory) {
    this.doctorRepo = doctorRepo;
    this.clinicRepo = clinicRepo;
    this.factory = factory;
  }

  async registerDoctor(dto) {
    const doctor = this.factory.createDoctor(dto);
    return await this.doctorRepo.save(doctor);
  }

  async approveDoctor(doctorId, adminId) {
    return await this.doctorRepo.updateVerificationStatus(doctorId, "Approved");
  }

  async rejectDoctor(doctorId, adminId, reason) {
    return await this.doctorRepo.updateVerificationStatus(doctorId, "Rejected");
  }

  async assignDoctorToClinic(doctorId, clinicId) {
    // Verify clinic exists
    const clinic = await this.clinicRepo.findById(clinicId);
    if (!clinic) throw new Error("Clinic not found");

    return await this.doctorRepo.assignToClinic(doctorId, clinicId);
  }
}
