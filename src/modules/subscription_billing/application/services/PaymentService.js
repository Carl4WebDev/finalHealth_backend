import SubscriptionPayment from "../../domain/entities/SubscriptionPayment.js";

/**
 * Orchestrates gateway + payment repository.
 * Only this class will change when you plug in real PayMongo.
 */
export default class PaymentService {
  constructor(paymentRepo, paymentGateway) {
    this.paymentRepo = paymentRepo;
    this.paymentGateway = paymentGateway;
  }

  async processInitialPayment({ subscription, plan, paymentMethod }) {
    const gatewayResult = await this.paymentGateway.charge({
      amount: Number(plan.price),
      currency: "PHP",
      paymentMethod,
      description: `Initial subscription payment for plan ${plan.planName}`,
    });

    const paymentEntity = new SubscriptionPayment.Builder()
      .setSubscriptionId(subscription.subscriptionId)
      .setAmount(plan.price)
      .setPaymentMethod(paymentMethod)
      .setTransactionId(gatewayResult.transactionId)
      .setStatus(gatewayResult.status)
      .build();

    return await this.paymentRepo.save(paymentEntity);
  }

  async processRenewalPayment({ subscription, plan, paymentMethod }) {
    const gatewayResult = await this.paymentGateway.charge({
      amount: Number(plan.price),
      currency: "PHP",
      paymentMethod,
      description: `Renewal subscription payment for plan ${plan.planName}`,
    });

    const paymentEntity = new SubscriptionPayment.Builder()
      .setSubscriptionId(subscription.subscriptionId)
      .setAmount(plan.price)
      .setPaymentMethod(paymentMethod)
      .setTransactionId(gatewayResult.transactionId)
      .setStatus(gatewayResult.status)
      .build();

    return await this.paymentRepo.save(paymentEntity);
  }
}
