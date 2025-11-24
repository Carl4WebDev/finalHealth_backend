export default class SubscriptionPayment {
  constructor(builder) {
    this.paymentId = builder.paymentId;
    this.subscriptionId = builder.subscriptionId;
    this.amount = builder.amount;
    this.paymentMethod = builder.paymentMethod; // 'cash' | 'gcash' | 'card' | 'bank'
    this.transactionId = builder.transactionId || null;
    this.paymentDate = builder.paymentDate ?? new Date();
    this.status = builder.status ?? "pending"; // 'paid' | 'pending' | 'failed'
  }

  static get Builder() {
    return class {
      setPaymentId(v) {
        this.paymentId = v;
        return this;
      }
      setSubscriptionId(v) {
        this.subscriptionId = v;
        return this;
      }
      setAmount(v) {
        this.amount = v;
        return this;
      }
      setPaymentMethod(v) {
        this.paymentMethod = v;
        return this;
      }
      setTransactionId(v) {
        this.transactionId = v;
        return this;
      }
      setPaymentDate(v) {
        this.paymentDate = v;
        return this;
      }
      setStatus(v) {
        this.status = v;
        return this;
      }

      build() {
        if (!this.subscriptionId) throw new Error("subscriptionId required");
        if (this.amount == null) throw new Error("amount required");
        if (!this.paymentMethod) throw new Error("paymentMethod required");
        return new SubscriptionPayment(this);
      }
    };
  }

  markPaid(txId) {
    this.status = "paid";
    this.transactionId = txId || this.transactionId;
  }

  markFailed() {
    this.status = "failed";
  }
}
