import FreeBillingStrategy from "./FreeBillingStrategy.js";
import MonthlyBillingStrategy from "./MonthlyBillingStrategy.js";
import YearlyBillingStrategy from "./YearlyBillingStrategy.js";

export function getBillingStrategy(planType) {
  switch (planType) {
    case "free":
      return new FreeBillingStrategy();
    case "monthly":
      return new MonthlyBillingStrategy();
    case "yearly":
      return new YearlyBillingStrategy();
    default:
      throw new Error(`Unsupported planType: ${planType}`);
  }
}
