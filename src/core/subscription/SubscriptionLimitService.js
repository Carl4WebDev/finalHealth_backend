import AppError from "../errors/AppError.js";

import UserSubscriptionRepo from "../../modules/subscription_billing/infrastructure/UserSubscriptionRepo.js";
import DoctorRepo from "../../modules/clinic_management/infrastructure/DoctorRepo.js";
import ClinicRepo from "../../modules/clinic_management/infrastructure/ClinicRepo.js";

const userSubscriptionRepo = new UserSubscriptionRepo();
const doctorRepo = new DoctorRepo();
const clinicRepo = new ClinicRepo();

class SubscriptionLimitService {
  isSubscriptionExpired(subscription) {
    if (!subscription) return true;

    if (subscription.status && subscription.status !== "active") {
      return true;
    }

    if (!subscription.endDate) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(subscription.endDate);
    endDate.setHours(0, 0, 0, 0);

    return endDate < today;
  }

  enforceSubscriptionPeriod(subscription) {
    if (this.isSubscriptionExpired(subscription)) {
      throw new AppError(
        "Subscription period has ended. Please renew your subscription to continue.",
        403,
        "SUBSCRIPTION_EXPIRED",
        {
          planType: subscription?.planType ?? null,
          status: subscription?.status ?? null,
          endDate: subscription?.endDate ?? null,
        },
      );
    }
  }

  async getActiveSubscription(userId) {
    console.log("getActiveSubscription START:", userId);

    let subscription = await userSubscriptionRepo.findActiveByUser(userId);
    console.log("findActiveByUser RESULT:", subscription);

    // 🔴 NEW: check latest subscription if no active found
    if (!subscription) {
      console.log("No active subscription. Checking latest subscription...");

      const latest = await userSubscriptionRepo.findLatestByUser(userId);
      console.log("LATEST SUBSCRIPTION:", latest);

      // If user HAD a subscription but now expired → THROW (do NOT downgrade)
      if (latest) {
        throw new AppError(
          "Your subscription has expired. Please renew to continue.",
          403,
          "SUBSCRIPTION_EXPIRED",
          {
            planType: latest.planType,
            status: latest.status,
            endDate: latest.endDate,
          },
        );
      }

      // Only create free if user NEVER had subscription
      console.log("No subscription history. Creating free subscription...");
      subscription = await userSubscriptionRepo.createFreeSubscription(userId);
    }

    if (!subscription) {
      throw new AppError(
        "Unable to initialize subscription",
        500,
        "SUBSCRIPTION_INIT_FAILED",
      );
    }

    this.enforceSubscriptionPeriod(subscription);

    return subscription;
  }

  async getUserRules(userId) {
    console.log("getUserRules START:", userId);

    const subscription = await this.getActiveSubscription(userId);
    console.log("SUBSCRIPTION IN getUserRules:", subscription);

    if (!subscription.planType) {
      throw new AppError(
        "Subscription plan type is missing",
        500,
        "SUBSCRIPTION_PLAN_TYPE_MISSING",
      );
    }

    const rules = this.getRulesByPlan(subscription.planType);
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
        `Clinic limit reached for ${subscription.planType} subscription`,
        403,
        "CLINIC_LIMIT_REACHED",
        {
          current: currentClinics,
          limit: rules.maxClinics,
          planType: subscription.planType,
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
          maxDoctors: 5,
          maxClinics: 5,
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
          maxMedicalRecordsPerPatient: 100,
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
        `Doctor limit reached for ${subscription.planType} subscription`,
        403,
        "DOCTOR_LIMIT_REACHED",
        {
          current: currentDoctors,
          limit: rules.maxDoctors,
          planType: subscription.planType,
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
        `Medical record creation is not available for ${subscription.planType} subscription`,
        403,
        "MEDICAL_RECORD_ACCESS_DENIED",
        {
          planType: subscription.planType,
        },
      );
    }
  }

  async enforceMedicalRecordLimit(userId, patientId, medRepo) {
    const { subscription, rules } = await this.getUserRules(userId);

    const current = await medRepo.countMedicalRecordsByPatient(patientId);

    if (
      rules.maxMedicalRecordsPerPatient !== null &&
      current >= rules.maxMedicalRecordsPerPatient
    ) {
      throw new AppError(
        `Medical record limit reached for ${subscription.planType} subscription`,
        403,
        "MEDICAL_RECORD_LIMIT_REACHED",
        {
          current,
          limit: rules.maxMedicalRecordsPerPatient,
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
      planType: subscription.planType,
      planName: subscription.planName,
      rules,
    };
  }
}

export default new SubscriptionLimitService();
