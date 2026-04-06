// core/container/subscriptionContainer.js

// --- Repositories ---
import SubscriptionPlanRepo from "../../modules/subscription_billing/infrastructure/SubscriptionPlanRepo.js";
import UserSubscriptionRepo from "../../modules/subscription_billing/infrastructure/UserSubscriptionRepo.js";

import DoctorRepo from "../../modules/clinic_management/infrastructure/DoctorRepo.js";
import ClinicRepo from "../../modules/clinic_management/infrastructure/ClinicRepo.js";

import RecordRepo from "../../modules/medical_records_management/infrastructure/RecordRepo.js";
import UserRepo from "../../modules/user/infrastructure/UserRepo.js";

// --- Services ---
import SubscriptionLimitService from "../../modules/subscription_billing/application/services/SubscriptionLimitService.js";
import SubscriptionGuard from "../../modules/subscription_billing/application/guards/SubscriptionGuard.js";

// --- Instantiate Repos (SINGLETON STYLE) ---
const planRepo = new SubscriptionPlanRepo();
const userSubRepo = new UserSubscriptionRepo();

const doctorRepo = new DoctorRepo();
const clinicRepo = new ClinicRepo();
const recordRepo = new RecordRepo();
const userRepo = new UserRepo();

// --- Limit Service ---
const subscriptionLimitService = new SubscriptionLimitService(
  userSubRepo,
  doctorRepo,
  clinicRepo,
  recordRepo,
  planRepo,
  userRepo,
);

// --- Guard (MAIN EXPORT) ---
const subscriptionGuard = new SubscriptionGuard(subscriptionLimitService);

// --- Export EVERYTHING needed ---
export {
  subscriptionGuard,
  subscriptionLimitService,

  // optional (if you want access elsewhere)
  planRepo,
  userSubRepo,
  doctorRepo,
  clinicRepo,
  recordRepo,
  userRepo,
};
