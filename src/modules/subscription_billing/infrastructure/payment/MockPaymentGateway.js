import IPaymentGateway from "../../domain/payment/IPaymentGateway.js";

export default class MockPaymentGateway extends IPaymentGateway {
  async charge(payload) {
    // For now, always succeed. When you integrate PayMongo,
    // replace this entire class with real HTTP calls.
    const txId = `MOCK-${Date.now()}`;
    return {
      status: "paid",
      transactionId: txId,
    };
  }
}
