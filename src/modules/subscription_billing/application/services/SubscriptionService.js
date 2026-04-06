import { getBillingStrategy } from "../../domain/billing/BillingStrategyFactory.js";
import UserSubscription from "../../domain/entities/UserSubscription.js";

export default class SubscriptionService {
  constructor(planRepo, subscriptionRepo, paymentService, paymentRepo) {
    this.planRepo = planRepo;
    this.subscriptionRepo = subscriptionRepo;
    this.paymentService = paymentService;
    this.paymentRepo = paymentRepo;
  }

  // REQ033, REQ034, REQ035, REQ036, REQ038
  async subscribe(dto) {
    const plan = await this.planRepo.findById(dto.planId);
    if (!plan) throw new Error("Plan not found");

    // 🔥 IMPORTANT: check existing active subscription
    const existing = await this.subscriptionRepo.findActiveByUser(dto.userId);

    const strategy = getBillingStrategy(plan.planType);
    const startDate = new Date().toISOString().slice(0, 10);
    const endDate = strategy.calculateEndDate(startDate);

    let subscription;

    if (existing) {
      // 🔁 Upgrade / re-subscribe
      subscription = existing
        .toBuilder()
        .setPlanId(plan.planId)
        .setStartDate(startDate)
        .setEndDate(endDate)
        .setAutoRenew(dto.autoRenew)
        .setStatus("active")
        .build();

      subscription = await this.subscriptionRepo.update(
        subscription.subscriptionId,
        subscription,
      );
    } else {
      // 🆕 First-time subscription
      const subEntity = new UserSubscription.Builder()
        .setUserId(dto.userId)
        .setPlanId(plan.planId)
        .setStartDate(startDate)
        .setEndDate(endDate)
        .setAutoRenew(dto.autoRenew)
        .setStatus("active")
        .build();

      subscription = await this.subscriptionRepo.save(subEntity);
    }

    const payment = await this.paymentService.processInitialPayment({
      subscription,
      plan,
      paymentMethod: dto.paymentMethod,
    });

    return { subscription, payment, plan };
  }

  // REQ037
  async renewIfEligible(subscriptionId, paymentMethod = "gcash") {
    const sub = await this.subscriptionRepo.findById(subscriptionId);
    if (!sub) throw new Error("Subscription not found");

    const plan = await this.planRepo.findById(sub.planId);
    if (!plan) throw new Error("Plan not found");

    const strategy = getBillingStrategy(plan.planType);

    const newStart = sub.endDate;
    const newEnd = strategy.calculateEndDate(newStart);

    const updated = sub
      .toBuilder()
      .setStartDate(newStart)
      .setEndDate(newEnd)
      .setRenewalDate(newStart)
      .setStatus("active")
      .build();

    const saved = await this.subscriptionRepo.update(
      updated.subscriptionId,
      updated,
    );

    await this.paymentService.processRenewalPayment({
      subscription: saved,
      plan,
      paymentMethod,
    });

    return saved;
  }

  // REQ039
  async checkUsageAgainstPlan(userId, currentUsers, currentPatients) {
    const active = await this.subscriptionRepo.findActiveByUser(userId);
    if (!active) throw new Error("No active subscription");

    const plan = await this.planRepo.findById(active.planId);
    if (!plan) throw new Error("Plan not found");

    const usersExceeded = currentUsers >= plan.maxNumberUsers;
    const patientsExceeded = currentPatients >= plan.maxNumberPatient;

    return {
      usersExceeded,
      patientsExceeded,
      plan,
      subscription: active,
    };
  }

  async cancelForUser(userId) {
    const active = await this.subscriptionRepo.findActiveByUser(userId);
    if (!active) throw new Error("No active subscription to cancel");

    const updated = active
      .toBuilder()
      .setStatus("cancelled")
      .setAutoRenew(false)
      .build();

    return await this.subscriptionRepo.update(updated.subscriptionId, updated);
  }

  async getUserSubscriptionHistory(userId) {
    const rows = await this.subscriptionRepo.findHistoryWithPlan(userId);

    const subscriptions = rows.map((r) => ({
      subscriptionId: r.subscription_id,
      planId: r.plan_id,
      planName: r.plan_name,
      planType: r.plan_type,
      price: Number(r.price),
      startDate: r.start_date,
      endDate: r.end_date,
      status: r.status,
      autoRenew: r.auto_renew,
      renewalDate: r.renewal_date,
      createdAt: r.created_at,
    }));

    return { subscriptions };
  }

  async getUserPaymentHistory(userId) {
    const payments = await this.paymentRepo.findByUser(userId);
    console.log(payments);

    const enriched = [];

    for (const p of payments) {
      const subscriptionId = p.subscriptionId;

      const sub = await this.subscriptionRepo.findById(subscriptionId);
      if (!sub) continue;

      const plan = await this.planRepo.findById(sub.planId);

      enriched.push({
        paymentId: p.paymentId,
        subscriptionId: subscriptionId,
        planName: plan?.planName || "Unknown Plan",
        amount: p.amount,
        paymentMethod: p.paymentMethod,
        transactionId: p.transactionId,
        paymentDate: p.paymentDate,
        status: p.status,
      });
    }

    return { payments: enriched };
  }
}
