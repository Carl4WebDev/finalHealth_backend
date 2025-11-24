export default class SubscriptionPlan {
  constructor(builder) {
    this.planId = builder.planId;
    this.planName = builder.planName;
    this.planType = builder.planType; // 'free' | 'monthly' | 'yearly'
    this.price = builder.price;
    this.maxNumberUsers = builder.maxNumberUsers;
    this.maxNumberPatient = builder.maxNumberPatient;
    this.description = builder.description;
    this.isActive = builder.isActive ?? true;
    this.createdAt = builder.createdAt ?? new Date();
  }

  static get Builder() {
    return class {
      setPlanId(v) {
        this.planId = v;
        return this;
      }
      setPlanName(v) {
        this.planName = v;
        return this;
      }
      setPlanType(v) {
        this.planType = v;
        return this;
      }
      setPrice(v) {
        this.price = v;
        return this;
      }
      setMaxNumberUsers(v) {
        this.maxNumberUsers = v;
        return this;
      }
      setMaxNumberPatient(v) {
        this.maxNumberPatient = v;
        return this;
      }
      setDescription(v) {
        this.description = v;
        return this;
      }
      setIsActive(v) {
        this.isActive = v;
        return this;
      }
      setCreatedAt(v) {
        this.createdAt = v;
        return this;
      }

      build() {
        if (!this.planName) throw new Error("planName required");
        if (!this.planType) throw new Error("planType required");
        if (this.price == null) throw new Error("price required");
        if (this.maxNumberUsers == null)
          throw new Error("maxNumberUsers required");
        if (this.maxNumberPatient == null)
          throw new Error("maxNumberPatient required");
        return new SubscriptionPlan(this);
      }
    };
  }
}
