import AppError from "../errors/AppError.js";

import UserSubscriptionRepo from "../../modules/subscription_billing/infrastructure/UserSubscriptionRepo.js";
import DoctorRepo from "../../modules/clinic_management/infrastructure/DoctorRepo.js";
import ClinicRepo from "../../modules/clinic_management/infrastructure/ClinicRepo.js";

const userSubscriptionRepo = new UserSubscriptionRepo();
const doctorRepo = new DoctorRepo();
const clinicRepo = new ClinicRepo();

class SubscriptionLimitService {
  async getActiveSubscription(userId) {
    let subscription = await userSubscriptionRepo.findActiveByUser(userId);

    if (!subscription) {
      subscription = await userSubscriptionRepo.createFreeSubscription(userId);
    }

    if (!subscription) {
      throw new AppError("Unable to initialize subscription", 500, {
        code: "SUBSCRIPTION_INIT_FAILED",
      });
    }

    return subscription;
  }

  getRulesByPlan(planType) {
    switch (planType) {
      case "free":
        return {
          maxDoctors: 1,
          maxClinics: 1,
          maxUsers: 1,
          canCreateMedicalRecords: true,
          maxMedicalRecordsPerPatient: 10,
        };

      case "monthly":
        return {
          maxDoctors: 3,
          maxClinics: 3,
          maxUsers: 2,
          canCreateMedicalRecords: true,
          maxMedicalRecordsPerPatient: 50,
        };

      case "yearly":
        return {
          maxDoctors: null,
          maxClinics: null,
          maxUsers: null,
          canCreateMedicalRecords: true,
          maxMedicalRecordsPerPatient: null,
        };

      default:
        throw new AppError("Invalid subscription plan type", 400, {
          code: "INVALID_PLAN_TYPE",
        });
    }
  }

  async getUserRules(userId) {
    const subscription = await this.getActiveSubscription(userId);
    const rules = this.getRulesByPlan(subscription.plan_type);

    return {
      subscription,
      rules,
    };
  }

  async enforceDoctorLimit(userId) {
    const { subscription, rules } = await this.getUserRules(userId);

    if (rules.maxDoctors === null) return;

    const currentDoctors = await doctorRepo.countByUser(userId);

    if (currentDoctors >= rules.maxDoctors) {
      throw new AppError(
        `Doctor limit reached for ${subscription.plan_type} subscription`,
        403,
        {
          code: "DOCTOR_LIMIT_REACHED",
          meta: {
            current: currentDoctors,
            limit: rules.maxDoctors,
            planType: subscription.plan_type,
          },
        },
      );
    }
  }

  async enforceClinicLimit(userId) {
    const { subscription, rules } = await this.getUserRules(userId);

    if (rules.maxClinics === null) return;

    const currentClinics = await clinicRepo.countByUser(userId);

    if (currentClinics >= rules.maxClinics) {
      throw new AppError(
        `Clinic limit reached for ${subscription.plan_type} subscription`,
        403,
        {
          code: "CLINIC_LIMIT_REACHED",
          meta: {
            current: currentClinics,
            limit: rules.maxClinics,
            planType: subscription.plan_type,
          },
        },
      );
    }
  }

  async canCreateMedicalRecords(userId) {
    const { rules } = await this.getUserRules(userId);
    return rules.canCreateMedicalRecords;
  }

  async enforceMedicalRecordAccess(userId) {
    const { subscription, rules } = await this.getUserRules(userId);

    if (!rules.canCreateMedicalRecords) {
      throw new AppError(
        `Medical record creation is not available for ${subscription.plan_type} subscription`,
        403,
        {
          code: "MEDICAL_RECORD_ACCESS_DENIED",
          meta: {
            planType: subscription.plan_type,
          },
        },
      );
    }
  }

  async getMedicalRecordLimitPerPatient(userId) {
    const { rules } = await this.getUserRules(userId);
    return rules.maxMedicalRecordsPerPatient;
  }

  async getPlanSnapshot(userId) {
    const { subscription, rules } = await this.getUserRules(userId);

    return {
      planType: subscription.plan_type,
      planName: subscription.plan_name,
      rules,
    };
  }
}

export default new SubscriptionLimitService();
