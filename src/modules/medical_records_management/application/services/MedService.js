import Prescription from "../../domain/entities/Prescription.js";

export default class MedService {
  constructor(medRepo) {
    this.medRepo = medRepo;
  }

  async getPatientOfDoctorInClinic(doctorId, clinicId, userId) {
    return await this.medRepo.getPatientOfDoctorInClinic(
      doctorId,
      clinicId,
      userId,
    );
  }

  async getPatientInfo(patientId) {
    return await this.medRepo.getPatientInfo(patientId);
  }

  async getPatientMedicalRecords(patientId) {
    return await this.medRepo.getPatientMedicalRecords(patientId);
  }
  async getMedicalRecordsFullDetails(recordId) {
    return await this.medRepo.getMedicalRecordsFullDetails(recordId);
  }

  async createMedicalRecord(patientId, dto, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401);
    }

    console.log(dto);
    return await this.medRepo.createFullMedicalRecord({
      patientId,
      ...dto,
    });
  }

  async addDocuments(recordId, files, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401);
    }

    const exists = await this.medRepo.findById(recordId);
    if (!exists) {
      throw new AppError("Medical record not found", 404);
    }

    const docs = files.map((f) => ({
      recordId,
      path: `/uploads/medical-records/${f.filename}`,
      uploadedBy: actor.id,
    }));

    await this.medRepo.insertDocuments(docs);
  }
}
