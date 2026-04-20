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

    const normalizedData = {
      patientId,
      ...dto,
      formType: dto.formType ?? dto.form_type ?? "general",
      preEmploymentData:
        dto.preEmploymentData ?? dto.pre_employment_data ?? null,

      consultation_fee: Number(dto.consultation_fee ?? 0),
      medicine_fee: Number(dto.medicine_fee ?? 0),
      lab_fee: Number(dto.lab_fee ?? 0),
      other_fee: Number(dto.other_fee ?? 0),
    };

    console.log("FORM TYPE:", normalizedData.formType);
    console.log("PRE EMP DATA:", normalizedData.preEmploymentData);
    console.log("CONSULTATION FEE:", normalizedData.consultation_fee);
    console.log("MEDICINE FEE:", normalizedData.medicine_fee);
    console.log("LAB FEE:", normalizedData.lab_fee);
    console.log("OTHER FEE:", normalizedData.other_fee);

    const created = await this.medRepo.createFullMedicalRecord(normalizedData);

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

  async getAllDiagnoses(actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    return await this.medRepo.getAllDiagnoses(actor.id);
  }

  async createDiagnosis(dto, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const diagnosisName = dto?.diagnosisName?.trim();

    if (!diagnosisName) {
      throw new AppError(
        "Diagnosis name is required",
        400,
        "DIAGNOSIS_NAME_REQUIRED",
      );
    }

    try {
      return await this.medRepo.createDiagnosis(actor.id, diagnosisName);
    } catch (err) {
      if (err.code === "23505") {
        throw new AppError(
          "Diagnosis already exists",
          409,
          "DIAGNOSIS_ALREADY_EXISTS",
        );
      }
      throw err;
    }
  }

  async updateDiagnosis(diagnosisId, dto, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const diagnosisName = dto?.diagnosisName?.trim();

    if (!diagnosisName) {
      throw new AppError(
        "Diagnosis name is required",
        400,
        "DIAGNOSIS_NAME_REQUIRED",
      );
    }

    try {
      const updated = await this.medRepo.updateDiagnosis(
        actor.id,
        diagnosisId,
        diagnosisName,
      );

      if (!updated) {
        throw new AppError("Diagnosis not found", 404, "DIAGNOSIS_NOT_FOUND");
      }

      return updated;
    } catch (err) {
      if (err.code === "23505") {
        throw new AppError(
          "Diagnosis already exists",
          409,
          "DIAGNOSIS_ALREADY_EXISTS",
        );
      }
      throw err;
    }
  }

  async deleteDiagnosis(diagnosisId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const deleted = await this.medRepo.deleteDiagnosis(actor.id, diagnosisId);

    if (!deleted) {
      throw new AppError("Diagnosis not found", 404, "DIAGNOSIS_NOT_FOUND");
    }

    return deleted;
  }

  async getAllTreatments(actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    return await this.medRepo.getAllTreatments(actor.id);
  }

  async createTreatment(dto, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const treatmentName = dto?.treatmentName?.trim();

    if (!treatmentName) {
      throw new AppError(
        "Treatment name is required",
        400,
        "TREATMENT_NAME_REQUIRED",
      );
    }

    try {
      return await this.medRepo.createTreatment(actor.id, treatmentName);
    } catch (err) {
      if (err.code === "23505") {
        throw new AppError(
          "Treatment already exists",
          409,
          "TREATMENT_ALREADY_EXISTS",
        );
      }
      throw err;
    }
  }

  async updateTreatment(treatmentId, dto, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const treatmentName = dto?.treatmentName?.trim();

    if (!treatmentName) {
      throw new AppError(
        "Treatment name is required",
        400,
        "TREATMENT_NAME_REQUIRED",
      );
    }

    try {
      const updated = await this.medRepo.updateTreatment(
        actor.id,
        treatmentId,
        treatmentName,
      );

      if (!updated) {
        throw new AppError("Treatment not found", 404, "TREATMENT_NOT_FOUND");
      }

      return updated;
    } catch (err) {
      if (err.code === "23505") {
        throw new AppError(
          "Treatment already exists",
          409,
          "TREATMENT_ALREADY_EXISTS",
        );
      }
      throw err;
    }
  }

  async deleteTreatment(treatmentId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const deleted = await this.medRepo.deleteTreatment(actor.id, treatmentId);

    if (!deleted) {
      throw new AppError("Treatment not found", 404, "TREATMENT_NOT_FOUND");
    }

    return deleted;
  }
}
