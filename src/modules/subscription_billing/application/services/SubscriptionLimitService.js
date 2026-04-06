import AppError from "../../../../core/errors/AppError.js";

export default class SubscriptionLimitService {
  constructor(userSubRepo, doctorRepo, clinicRepo, recordRepo, planRepo) {
    this.userSubRepo = userSubRepo;
    this.doctorRepo = doctorRepo;
    this.clinicRepo = clinicRepo;
    this.recordRepo = recordRepo;
    this.planRepo = planRepo;
  }

  async getUserPlan(userId) {
    const sub = await this.userSubRepo.findActiveByUser(userId);

    if (!sub) {
      throw new AppError(
        "No active subscription found",
        403,
        "SUBSCRIPTION_REQUIRED",
      );
    }

    const plan = await this.planRepo.findById(sub.planId);
    return plan;
  }

  async checkDoctorLimit(userId, plan = null) {
    if (!plan) plan = await this.getUserPlan(userId);

    if (plan.maxDoctors === null) return;

    const count = await this.doctorRepo.countByUser(userId);

    if (count >= plan.maxDoctors) {
      throw new AppError(
        "Doctor limit reached for your subscription",
        403,
        "DOCTOR_LIMIT_REACHED",
      );
    }
  }

  async checkClinicLimit(userId, plan = null) {
    if (!plan) plan = await this.getUserPlan(userId);

    if (plan.maxClinics === null) return;

    const count = await this.clinicRepo.countByUser(userId);

    if (count >= plan.maxClinics) {
      throw new AppError(
        "Clinic limit reached for your subscription",
        403,
        "CLINIC_LIMIT_REACHED",
      );
    }
  }

  async checkMedicalRecordLimit(patientId, userId, plan = null) {
    if (!plan) plan = await this.getUserPlan(userId);

    if (plan.maxMedicalRecordsPerPatient === 0) {
      throw new AppError(
        "Your plan does not allow medical records",
        403,
        "MEDICAL_RECORD_NOT_ALLOWED",
      );
    }

    if (plan.maxMedicalRecordsPerPatient === null) return;

    const count = await this.recordRepo.countByPatient(patientId);

    if (count >= plan.maxMedicalRecordsPerPatient) {
      throw new AppError(
        "Medical record limit reached for this patient",
        403,
        "MEDICAL_RECORD_LIMIT_REACHED",
      );
    }
  }
}
