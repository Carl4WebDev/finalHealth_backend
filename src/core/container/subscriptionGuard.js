// modules/subscription_billing/application/guards/SubscriptionGuard.js

import AppError from "../errors/AppError";

export default class SubscriptionGuard {
  constructor(limitService) {
    this.limitService = limitService;
  }

  async check(userId, action, context = {}) {
    if (!userId) {
      throw new AppError(
        "User ID is required for subscription validation",
        400,
        "INVALID_USER",
      );
    }

    switch (action) {
      // 👨‍⚕️ DOCTOR
      case "CREATE_DOCTOR":
        return await this.limitService.checkDoctorLimit(userId);

      // 🏥 CLINIC
      case "CREATE_CLINIC":
        return await this.limitService.checkClinicLimit(userId);

      // 📄 MEDICAL RECORD
      case "CREATE_MEDICAL_RECORD":
        if (!context.patientId) {
          throw new AppError(
            "patientId is required for medical record creation",
            400,
            "MISSING_PATIENT_ID",
          );
        }

        return await this.limitService.checkMedicalRecordLimit(
          context.patientId,
          userId,
        );

      // 👥 USER (staff / sub-users)
      case "CREATE_USER":
        return await this.limitService.checkUserLimit(userId);

      default:
        throw new AppError(
          `Unknown subscription action: ${action}`,
          400,
          "INVALID_SUBSCRIPTION_ACTION",
        );
    }
  }
}
