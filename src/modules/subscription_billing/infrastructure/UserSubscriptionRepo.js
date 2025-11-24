import IUserSubscriptionRepository from "../domain/repositories/IUserSubscriptionRepository.js";
import UserSubscription from "../domain/entities/UserSubscription.js";
import db from "../../../core/database/db.js";

export default class UserSubscriptionRepo extends IUserSubscriptionRepository {
  async save(entity) {
    const query = `
      INSERT INTO user_subscription
      (user_id, plan_id, start_date, end_date, auto_renew, status, renewal_date)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *;
    `;
    const values = [
      entity.userId,
      entity.planId,
      entity.startDate,
      entity.endDate,
      entity.autoRenew,
      entity.status,
      entity.renewalDate,
    ];

    const res = await db.query(query, values);
    return this._toEntity(res.rows[0]);
  }

  async update(id, entity) {
    const query = `
      UPDATE user_subscription
      SET
        plan_id = $1,
        start_date = $2,
        end_date = $3,
        auto_renew = $4,
        status = $5,
        renewal_date = $6
      WHERE subscription_id = $7
      RETURNING *;
    `;
    const values = [
      entity.planId,
      entity.startDate,
      entity.endDate,
      entity.autoRenew,
      entity.status,
      entity.renewalDate,
      id,
    ];

    const res = await db.query(query, values);
    if (!res.rows.length) return null;
    return this._toEntity(res.rows[0]);
  }

  async findById(id) {
    const res = await db.query(
      "SELECT * FROM user_subscription WHERE subscription_id = $1",
      [id]
    );
    if (!res.rows.length) return null;
    return this._toEntity(res.rows[0]);
  }

  async findActiveByUser(userId) {
    const res = await db.query(
      `
      SELECT * FROM user_subscription
      WHERE user_id = $1
        AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1;
      `,
      [userId]
    );
    if (!res.rows.length) return null;
    return this._toEntity(res.rows[0]);
  }

  _toEntity(row) {
    return new UserSubscription.Builder()
      .setSubscriptionId(row.subscription_id)
      .setUserId(row.user_id)
      .setPlanId(row.plan_id)
      .setStartDate(
        row.start_date?.toISOString?.().slice(0, 10) || row.start_date
      )
      .setEndDate(row.end_date?.toISOString?.().slice(0, 10) || row.end_date)
      .setAutoRenew(row.auto_renew)
      .setStatus(row.status)
      .setRenewalDate(
        row.renewal_date
          ? row.renewal_date.toISOString?.().slice(0, 10) || row.renewal_date
          : null
      )
      .setCreatedAt(row.created_at)
      .build();
  }
}
