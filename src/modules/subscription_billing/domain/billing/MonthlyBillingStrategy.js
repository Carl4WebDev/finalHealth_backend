import IBillingStrategy from "./IBillingStrategy.js";

export default class MonthlyBillingStrategy extends IBillingStrategy {
  calculateEndDate(startDate) {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  }
}
