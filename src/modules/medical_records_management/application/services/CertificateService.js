import Certificate from "../../domain/entities/certificates.js";

export default class CertificateService {
  constructor(certRepo) {
    this.certRepo = certRepo;
  }

  async createCertificate(dto) {
    const cert = new Certificate.Builder()
      .setAppointmentId(dto.appointmentId)
      .setPatientId(dto.patientId)
      .setCertificateType(dto.certificateType)
      .setIssueDate(dto.issueDate)
      .setRemarks(dto.remarks)
      .setCertificateImgPath(dto.certificateImgPath)
      .build();

    return await this.certRepo.save(cert);
  }

  async updateCertificate(dto) {
    const existing = await this.certRepo.findById(dto.certificateId);
    if (!existing) throw new Error("Certificate not found");

    const updated = existing
      .toBuilder()
      .setCertificateType(dto.certificateType ?? existing.certificateType)
      .setIssueDate(dto.issueDate ?? existing.issueDate)
      .setRemarks(dto.remarks ?? existing.remarks)
      .setCertificateImgPath(
        dto.certificateImgPath !== undefined
          ? dto.certificateImgPath
          : existing.certificateImgPath
      )
      .build();

    return await this.certRepo.update(dto.certificateId, updated);
  }

  async getById(id) {
    return await this.certRepo.findById(id);
  }

  async listByAppointment(appointmentId) {
    return await this.certRepo.findByAppointment(appointmentId);
  }

  async listByPatient(patientId) {
    return await this.certRepo.findByPatient(patientId);
  }
}
