import SubscriptionPlanRepo from "../../infrastructure/SubscriptionPlanRepo.js";
import UserSubscriptionRepo from "../../infrastructure/UserSubscriptionRepo.js";
import SubscriptionPaymentRepo from "../../infrastructure/SubscriptionPaymentRepo.js";
import MockPaymentGateway from "../../infrastructure/payment/MockPaymentGateway.js";

import SubscriptionService from "../../application/services/SubscriptionService.js";
import PaymentService from "../../application/services/PaymentService.js";

import SubscribeDTO from "../http/dtos/SubscribeDTO.js";

// Wiring (DI)
const planRepo = new SubscriptionPlanRepo();
const userSubRepo = new UserSubscriptionRepo();
const paymentRepo = new SubscriptionPaymentRepo();
const paymentGateway = new MockPaymentGateway(); // swap with PayMongo later

const paymentService = new PaymentService(paymentRepo, paymentGateway);
const subscriptionService = new SubscriptionService(
  planRepo,
  userSubRepo,
  paymentService
);

// GET /api/subscription/plans
export const listPlans = async (req, res) => {
  try {
    const plans = await planRepo.findActivePlans();
    res.status(200).json({ success: true, plans });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// POST /api/subscription/subscribe
export const subscribeToPlan = async (req, res) => {
  try {
    // assume you have auth middleware that sets req.user.id
    const userId = req.user?.user_id || req.user?.id;
    if (!userId) throw new Error("Authenticated user required");

    const dto = new SubscribeDTO(req.body, userId);
    const result = await subscriptionService.subscribe(dto);

    res.status(201).json({
      success: true,
      subscription: result.subscription,
      payment: result.payment,
      plan: result.plan,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// GET /api/subscription/me
export const getMyActiveSubscription = async (req, res) => {
  try {
    const userId = req.user?.user_id || req.user?.id;
    if (!userId) throw new Error("Authenticated user required");

    const active = await userSubRepo.findActiveByUser(userId);

    if (!active) {
      return res.status(200).json({
        success: true,
        subscription: null,
        plan: null,
      });
    }

    const plan = await planRepo.findById(active.planId);

    res.status(200).json({
      success: true,
      subscription: active,
      plan,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const cancelMySubscription = async (req, res) => {
  try {
    const userId = req.user?.user_id || req.user?.id;
    if (!userId) throw new Error("Authenticated user required");

    const cancelled = await subscriptionService.cancelForUser(userId);

    res.status(200).json({ success: true, subscription: cancelled });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
