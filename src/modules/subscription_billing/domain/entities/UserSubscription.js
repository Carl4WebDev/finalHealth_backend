export default class UserSubscription {
  constructor(builder) {
    this.subscriptionId = builder.subscriptionId;
    this.userId = builder.userId;
    this.planId = builder.planId;
    this.startDate = builder.startDate; // "YYYY-MM-DD"
    this.endDate = builder.endDate; // "YYYY-MM-DD"
    this.autoRenew = builder.autoRenew ?? true;
    this.status = builder.status ?? "active"; // 'active' | 'expired' | 'cancelled'
    this.renewalDate = builder.renewalDate || null;
    this.createdAt = builder.createdAt ?? new Date();
  }

  static get Builder() {
    return class {
      setSubscriptionId(v) {
        this.subscriptionId = v;
        return this;
      }
      setUserId(v) {
        this.userId = v;
        return this;
      }
      setPlanId(v) {
        this.planId = v;
        return this;
      }
      setStartDate(v) {
        this.startDate = v;
        return this;
      }
      setEndDate(v) {
        this.endDate = v;
        return this;
      }
      setAutoRenew(v) {
        this.autoRenew = v;
        return this;
      }
      setStatus(v) {
        this.status = v;
        return this;
      }
      setRenewalDate(v) {
        this.renewalDate = v;
        return this;
      }
      setCreatedAt(v) {
        this.createdAt = v;
        return this;
      }

      build() {
        if (!this.userId) throw new Error("userId required");
        if (!this.planId) throw new Error("planId required");
        if (!this.startDate) throw new Error("startDate required");
        if (!this.endDate) throw new Error("endDate required");
        return new UserSubscription(this);
      }
    };
  }

  toBuilder() {
    return new UserSubscription.Builder()
      .setSubscriptionId(this.subscriptionId)
      .setUserId(this.userId)
      .setPlanId(this.planId)
      .setStartDate(this.startDate)
      .setEndDate(this.endDate)
      .setAutoRenew(this.autoRenew)
      .setStatus(this.status)
      .setRenewalDate(this.renewalDate)
      .setCreatedAt(this.createdAt);
  }

  isExpired() {
    const today = new Date().toISOString().slice(0, 10);
    return this.endDate < today;
  }

  shouldRenew() {
    return this.autoRenew && this.status === "active" && this.isExpired();
  }
}
