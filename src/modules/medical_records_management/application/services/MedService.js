import Prescription from "../../domain/entities/Prescription.js";

import SubscriptionLimitService from "../../../../core/subscription/SubscriptionLimitService.js";
import AppError from "../../../../core/errors/AppError.js";

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

  // Vital Signs
  async getAllVitalSignsByPatient(patientId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    return await this.medRepo.getAllVitalSignsByPatient(patientId);
  }

  async getVitalSignById(vitalId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const vitalSign = await this.medRepo.getVitalSignById(vitalId);

    if (!vitalSign) {
      throw new AppError("Vital sign not found", 404, "VITAL_SIGN_NOT_FOUND");
    }

    return vitalSign;
  }

  async createVitalSign(patientId, dto, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const appointmentId = Number(dto?.appointmentId ?? dto?.appointment_id);

    if (!patientId) {
      throw new AppError("Patient ID is required", 400, "PATIENT_ID_REQUIRED");
    }

    if (!appointmentId) {
      throw new AppError(
        "Appointment ID is required",
        400,
        "APPOINTMENT_ID_REQUIRED",
      );
    }

    const normalizedData = {
      patientId: Number(patientId),
      appointmentId,
      bloodPressure: dto?.bloodPressure ?? dto?.blood_pressure ?? null,
      heartRate:
        dto?.heartRate !== undefined && dto?.heartRate !== null
          ? Number(dto.heartRate)
          : dto?.heart_rate !== undefined && dto?.heart_rate !== null
            ? Number(dto.heart_rate)
            : null,
      temperature: dto?.temperature ?? null,
      oxygenSaturation:
        dto?.oxygenSaturation !== undefined && dto?.oxygenSaturation !== null
          ? Number(dto.oxygenSaturation)
          : dto?.oxygen_saturation !== undefined &&
              dto?.oxygen_saturation !== null
            ? Number(dto.oxygen_saturation)
            : null,
      weight:
        dto?.weight !== undefined && dto?.weight !== null
          ? Number(dto.weight)
          : null,
      vitalImgPath: dto?.vitalImgPath ?? dto?.vital_img_path ?? null,
      medicalRecordId: dto?.medicalRecordId ?? dto?.medical_record_id ?? null,
    };

    return await this.medRepo.createVitalSign(normalizedData);
  }

  async updateVitalSign(vitalId, dto, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const existing = await this.medRepo.getVitalSignById(vitalId);

    if (!existing) {
      throw new AppError("Vital sign not found", 404, "VITAL_SIGN_NOT_FOUND");
    }

    const normalizedData = {
      appointmentId: Number(
        dto?.appointmentId ?? dto?.appointment_id ?? existing.appointment_id,
      ),
      patientId: Number(
        dto?.patientId ?? dto?.patient_id ?? existing.patient_id,
      ),
      bloodPressure:
        dto?.bloodPressure ??
        dto?.blood_pressure ??
        existing.blood_pressure ??
        null,
      heartRate:
        dto?.heartRate !== undefined && dto?.heartRate !== null
          ? Number(dto.heartRate)
          : dto?.heart_rate !== undefined && dto?.heart_rate !== null
            ? Number(dto.heart_rate)
            : existing.heart_rate,
      temperature:
        dto?.temperature !== undefined ? dto.temperature : existing.temperature,
      oxygenSaturation:
        dto?.oxygenSaturation !== undefined && dto?.oxygenSaturation !== null
          ? Number(dto.oxygenSaturation)
          : dto?.oxygen_saturation !== undefined &&
              dto?.oxygen_saturation !== null
            ? Number(dto.oxygen_saturation)
            : existing.oxygen_saturation,
      weight:
        dto?.weight !== undefined && dto?.weight !== null
          ? Number(dto.weight)
          : existing.weight,
      vitalImgPath:
        dto?.vitalImgPath ??
        dto?.vital_img_path ??
        existing.vital_img_path ??
        null,
      medicalRecordId:
        dto?.medicalRecordId ??
        dto?.medical_record_id ??
        existing.medical_record_id ??
        null,
    };

    return await this.medRepo.updateVitalSign(vitalId, normalizedData);
  }

  async deleteVitalSign(vitalId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const deleted = await this.medRepo.deleteVitalSign(vitalId);

    if (!deleted) {
      throw new AppError("Vital sign not found", 404, "VITAL_SIGN_NOT_FOUND");
    }

    return deleted;
  }

  async getPatientVisitHistory(patientId, userId) {
    if (!patientId || Number.isNaN(patientId)) {
      throw new AppError("Invalid patient id", 400, {
        code: "INVALID_PATIENT_ID",
      });
    }

    const patient = await this.medRepo.getPatientInfo(patientId, userId);

    if (!patient) {
      throw new AppError("Patient not found or inaccessible", 404, {
        code: "PATIENT_NOT_FOUND",
      });
    }

    const visitHistory = await this.medRepo.getPatientVisitHistory(
      patientId,
      userId,
    );

    return visitHistory;
  }

  // medical record
  async updateMedicalRecord(recordId, dto, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const existing = await this.medRepo.findById(recordId);

    if (!existing) {
      throw new AppError(
        "Medical record not found",
        404,
        "MEDICAL_RECORD_NOT_FOUND",
      );
    }

    const normalizedData = {
      record_date: dto.record_date,
      diagnosis: dto.diagnosis,
      treatment: dto.treatment,
      medications: dto.medications,
      assessment: dto.assessment,
      is_contagious: dto.is_contagious,
      contagious_description: dto.contagious_description,
      consultation_fee: Number(dto.consultation_fee ?? 0),
      medicine_fee: Number(dto.medicine_fee ?? 0),
      lab_fee: Number(dto.lab_fee ?? 0),
      other_fee: Number(dto.other_fee ?? 0),
      doctor_id: dto.doctor_id,
      clinic_id: dto.clinic_id,
      form_type: dto.form_type ?? "general",
      pre_employment_data: dto.pre_employment_data ?? null,
    };

    return await this.medRepo.updateMedicalRecord(recordId, normalizedData);
  }

  async deleteMedicalRecord(recordId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const deleted = await this.medRepo.deleteMedicalRecord(recordId);

    if (!deleted) {
      throw new AppError(
        "Medical record not found",
        404,
        "MEDICAL_RECORD_NOT_FOUND",
      );
    }

    return deleted;
  }

  // prescriptions
  async getAllPrescriptionsByRecord(recordId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    return await this.medRepo.getAllPrescriptionsByRecord(recordId);
  }

  async getPrescriptionById(prescriptionId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const prescription = await this.medRepo.getPrescriptionById(prescriptionId);

    if (!prescription) {
      throw new AppError(
        "Prescription not found",
        404,
        "PRESCRIPTION_NOT_FOUND",
      );
    }

    return prescription;
  }

  async createPrescription(recordId, dto, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const medicalRecord = await this.medRepo.findById(recordId);

    if (!medicalRecord) {
      throw new AppError(
        "Medical record not found",
        404,
        "MEDICAL_RECORD_NOT_FOUND",
      );
    }

    const normalizedData = {
      medicalRecordId: recordId,
      patientId: Number(dto.patient_id),
      medicationName: dto.medication_name,
      dosage: dto.dosage ?? null,
      frequency: dto.frequency ?? null,
      duration: dto.duration ?? null,
      prescriptionImgPath: dto.prescription_img_path ?? null,
    };

    return await this.medRepo.createPrescription(normalizedData);
  }

  async updatePrescription(prescriptionId, dto, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const existing = await this.medRepo.getPrescriptionById(prescriptionId);

    if (!existing) {
      throw new AppError(
        "Prescription not found",
        404,
        "PRESCRIPTION_NOT_FOUND",
      );
    }

    const normalizedData = {
      patientId: Number(dto.patient_id ?? existing.patient_id),
      medicationName: dto.medication_name ?? existing.medication_name,
      dosage: dto.dosage ?? existing.dosage,
      frequency: dto.frequency ?? existing.frequency,
      duration: dto.duration ?? existing.duration,
      prescriptionImgPath:
        dto.prescription_img_path ?? existing.prescription_img_path ?? null,
    };

    return await this.medRepo.updatePrescription(
      prescriptionId,
      normalizedData,
    );
  }

  async deletePrescription(prescriptionId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const deleted = await this.medRepo.deletePrescription(prescriptionId);

    if (!deleted) {
      throw new AppError(
        "Prescription not found",
        404,
        "PRESCRIPTION_NOT_FOUND",
      );
    }

    return deleted;
  }

  // lab results
  async getAllLabResultsByRecord(recordId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    return await this.medRepo.getAllLabResultsByRecord(recordId);
  }

  async getLabResultById(resultId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const labResult = await this.medRepo.getLabResultById(resultId);

    if (!labResult) {
      throw new AppError("Lab result not found", 404, "LAB_RESULT_NOT_FOUND");
    }

    return labResult;
  }

  async createLabResult(recordId, dto, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const medicalRecord = await this.medRepo.findById(recordId);

    if (!medicalRecord) {
      throw new AppError(
        "Medical record not found",
        404,
        "MEDICAL_RECORD_NOT_FOUND",
      );
    }

    const normalizedData = {
      medicalRecordId: recordId,
      patientId: Number(dto.patient_id),
      testType: dto.test_type,
      result: dto.result ?? null,
      interpretation: dto.interpretation ?? null,
      labImgPath: dto.lab_img_path ?? null,
    };

    return await this.medRepo.createLabResult(normalizedData);
  }

  async updateLabResult(resultId, dto, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const existing = await this.medRepo.getLabResultById(resultId);

    if (!existing) {
      throw new AppError("Lab result not found", 404, "LAB_RESULT_NOT_FOUND");
    }

    const normalizedData = {
      patientId: Number(dto.patient_id ?? existing.patient_id),
      testType: dto.test_type ?? existing.test_type,
      result: dto.result ?? existing.result,
      interpretation: dto.interpretation ?? existing.interpretation,
      labImgPath: dto.lab_img_path ?? existing.lab_img_path ?? null,
    };

    return await this.medRepo.updateLabResult(resultId, normalizedData);
  }

  async deleteLabResult(resultId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const deleted = await this.medRepo.deleteLabResult(resultId);

    if (!deleted) {
      throw new AppError("Lab result not found", 404, "LAB_RESULT_NOT_FOUND");
    }

    return deleted;
  }

  // certificates
  async getAllCertificatesByRecord(recordId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    return await this.medRepo.getAllCertificatesByRecord(recordId);
  }

  async getCertificateById(certificateId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const certificate = await this.medRepo.getCertificateById(certificateId);

    if (!certificate) {
      throw new AppError("Certificate not found", 404, "CERTIFICATE_NOT_FOUND");
    }

    return certificate;
  }

  async createCertificate(recordId, dto, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const medicalRecord = await this.medRepo.findById(recordId);

    if (!medicalRecord) {
      throw new AppError(
        "Medical record not found",
        404,
        "MEDICAL_RECORD_NOT_FOUND",
      );
    }

    const normalizedData = {
      medicalRecordId: recordId,
      patientId: Number(dto.patient_id),
      certificateType: dto.certificate_type,
      remarks: dto.remarks ?? null,
      certificateImgPath: dto.certificates_img_path ?? null,
    };

    return await this.medRepo.createCertificate(normalizedData);
  }

  async updateCertificate(certificateId, dto, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const existing = await this.medRepo.getCertificateById(certificateId);

    if (!existing) {
      throw new AppError("Certificate not found", 404, "CERTIFICATE_NOT_FOUND");
    }

    const normalizedData = {
      patientId: Number(dto.patient_id ?? existing.patient_id),
      certificateType: dto.certificate_type ?? existing.certificate_type,
      remarks: dto.remarks ?? existing.remarks,
      certificateImgPath:
        dto.certificates_img_path ?? existing.certificates_img_path ?? null,
    };

    return await this.medRepo.updateCertificate(certificateId, normalizedData);
  }

  async deleteCertificate(certificateId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const deleted = await this.medRepo.deleteCertificate(certificateId);

    if (!deleted) {
      throw new AppError("Certificate not found", 404, "CERTIFICATE_NOT_FOUND");
    }

    return deleted;
  }

  async getMedicalRecordByAppointmentId(appointmentId, actor) {
    if (!actor?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    if (!appointmentId || Number.isNaN(appointmentId)) {
      throw new AppError(
        "Invalid appointment id",
        400,
        "INVALID_APPOINTMENT_ID",
      );
    }

    return await this.medRepo.getMedicalRecordByAppointmentId(appointmentId);
  }
}
