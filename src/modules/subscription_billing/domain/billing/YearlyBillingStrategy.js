import IBillingStrategy from "./IBillingStrategy.js";

export default class YearlyBillingStrategy extends IBillingStrategy {
  calculateEndDate(startDate) {
    const d = new Date(startDate);
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
  }
}
