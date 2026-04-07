import AppError from "../errors/AppError.js";

import UserSubscriptionRepo from "../../modules/subscription_billing/infrastructure/UserSubscriptionRepo.js";
import DoctorRepo from "../../modules/clinic_management/infrastructure/DoctorRepo.js";
import ClinicRepo from "../../modules/clinic_management/infrastructure/ClinicRepo.js";

const userSubscriptionRepo = new UserSubscriptionRepo();
const doctorRepo = new DoctorRepo();
const clinicRepo = new ClinicRepo();

class SubscriptionLimitService {
  async getActiveSubscription(userId) {
    console.log("getActiveSubscription START:", userId);

    let subscription = await userSubscriptionRepo.findActiveByUser(userId);
    console.log("findActiveByUser RESULT:", subscription);

    if (!subscription) {
      console.log("No active subscription. Creating free subscription...");
      subscription = await userSubscriptionRepo.createFreeSubscription(userId);
      console.log("createFreeSubscription RESULT:", subscription);
    }

    if (!subscription) {
      throw new AppError(
        "Unable to initialize subscription",
        500,
        "SUBSCRIPTION_INIT_FAILED",
      );
    }

    return subscription;
  }

  async getUserRules(userId) {
    console.log("getUserRules START:", userId);

    const subscription = await this.getActiveSubscription(userId);
    console.log("SUBSCRIPTION IN getUserRules:", subscription);

    if (!subscription.plan_type) {
      throw new AppError(
        "Subscription plan type is missing",
        500,
        "SUBSCRIPTION_PLAN_TYPE_MISSING",
      );
    }

    const rules = this.getRulesByPlan(subscription.plan_type);
    console.log("RULES IN getUserRules:", rules);

    return {
      subscription,
      rules,
    };
  }

  async enforceClinicLimit(userId) {
    console.log("enforceClinicLimit START:", userId);

    const { subscription, rules } = await this.getUserRules(userId);
    console.log("SUBSCRIPTION:", subscription);
    console.log("RULES:", rules);

    if (rules.maxClinics === null) return;

    const currentClinics = await clinicRepo.countByUser(userId);
    console.log("CURRENT CLINICS:", currentClinics);

    if (currentClinics >= rules.maxClinics) {
      throw new AppError(
        `Clinic limit reached for ${subscription.plan_type} subscription`,
        403,
        "CLINIC_LIMIT_REACHED",
        {
          current: currentClinics,
          limit: rules.maxClinics,
          planType: subscription.plan_type,
        },
      );
    }

    console.log("PASSED CLINIC LIMIT");
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
        throw new AppError(
          "Invalid subscription plan type",
          400,
          "INVALID_PLAN_TYPE",
        );
    }
  }

  async enforceDoctorLimit(userId) {
    const { subscription, rules } = await this.getUserRules(userId);

    if (rules.maxDoctors === null) return;

    const currentDoctors = await doctorRepo.countByUser(userId);

    if (currentDoctors >= rules.maxDoctors) {
      throw new AppError(
        `Doctor limit reached for ${subscription.plan_type} subscription`,
        403,
        "DOCTOR_LIMIT_REACHED",
        {
          current: currentDoctors,
          limit: rules.maxDoctors,
          planType: subscription.plan_type,
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
        "MEDICAL_RECORD_ACCESS_DENIED",
        {
          planType: subscription.plan_type,
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
