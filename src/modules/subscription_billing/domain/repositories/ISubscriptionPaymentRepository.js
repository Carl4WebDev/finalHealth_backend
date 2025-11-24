export default class ISubscriptionPaymentRepository {
  async save(payment) {
    throw new Error("save() not implemented");
  }

  async listBySubscription(subscriptionId) {
    throw new Error("listBySubscription() not implemented");
  }
}
