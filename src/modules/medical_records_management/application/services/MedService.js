import Prescription from "../../domain/entities/Prescription.js";

import SubscriptionLimitService from "../../../../core/subscription/SubscriptionLimitService.js";

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
    console.log("CREATE MEDICAL RECORD PATIENT ID:", patientId);
    console.log("CREATE MEDICAL RECORD DTO:", dto);
    console.log("CREATE MEDICAL RECORD ACTOR:", actor);

    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    await SubscriptionLimitService.enforceMedicalRecordAccess(actor.id);

    await SubscriptionLimitService.enforceMedicalRecordLimit(
      actor.id,
      patientId,
      this.medRepo,
    );

    console.log("FORM TYPE:", dto.formType);
    console.log("PRE EMP DATA:", dto.preEmploymentData);

    const created = await this.medRepo.createFullMedicalRecord({
      patientId,
      ...dto,
      formType: dto.formType || "general",
      preEmploymentData: dto.preEmploymentData || null,
    });

    console.log("CREATED MEDICAL RECORD:", created);

    return created;
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
