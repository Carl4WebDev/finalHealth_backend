import IBillingStrategy from "./IBillingStrategy.js";

export default class FreeBillingStrategy extends IBillingStrategy {
  calculateEndDate(startDate) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + 7); // 7-day free trial
    return d.toISOString().slice(0, 10);
  }
}
