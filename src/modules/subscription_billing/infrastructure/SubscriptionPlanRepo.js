import ISubscriptionPlanRepository from "../domain/repositories/ISubscriptionPlanRepository.js";
import SubscriptionPlan from "../domain/entities/SubscriptionPlan.js";
import db from "../../../core/database/db.js";

export default class SubscriptionPlanRepo extends ISubscriptionPlanRepository {
  async findById(id) {
    const res = await db.query(
      'SELECT * FROM subscription_plan WHERE plan_id = $1 AND "isactive" = TRUE',
      [id]
    );
    if (!res.rows.length) return null;
    return this._toEntity(res.rows[0]);
  }

  async findActivePlans() {
    const res = await db.query(
      "SELECT * FROM subscription_plan WHERE isactive = TRUE ORDER BY price ASC"
    );
    return res.rows.map((r) => this._toEntity(r));
  }

  _toEntity(row) {
    return new SubscriptionPlan.Builder()
      .setPlanId(row.plan_id)
      .setPlanName(row.plan_name)
      .setPlanType(row.plan_type)
      .setPrice(Number(row.price))
      .setMaxNumberUsers(row.max_number_users)
      .setMaxNumberPatient(row.max_number_patient)
      .setDescription(row.description)
      .setIsActive(row.isactive)
      .setCreatedAt(row.created_at)
      .build();
  }
}
