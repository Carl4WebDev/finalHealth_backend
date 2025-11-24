export default class SubscribeDTO {
  constructor(body, userIdFromAuth) {
    this.userId = userIdFromAuth; // from auth middleware
    this.planId = Number(body.planId);
    this.paymentMethod = body.paymentMethod; // 'cash' | 'gcash' | 'card' | 'bank'
    this.autoRenew =
      body.autoRenew === undefined ? true : Boolean(body.autoRenew);
    this.startDate = body.startDate || new Date().toISOString().slice(0, 10);

    if (!this.planId) throw new Error("planId is required");
    if (!this.paymentMethod) throw new Error("paymentMethod is required");
  }
}
