import IUserSubscriptionRepository from "../domain/repositories/IUserSubscriptionRepository.js";
import UserSubscription from "../domain/entities/UserSubscription.js";
import db from "../../../core/database/db.js";

export default class UserSubscriptionRepo extends IUserSubscriptionRepository {
  async createFreeSubscription(userId) {
    console.log("createFreeSubscription START:", userId);

    const client = await db.getClient();

    try {
      await client.query("BEGIN");

      const freePlanRes = await client.query(`
      SELECT plan_id
      FROM subscription_plan
      WHERE plan_type = 'free'
        AND isactive = true
      LIMIT 1
    `);

      console.log("FREE PLAN RESULT:", freePlanRes.rows);

      if (!freePlanRes.rows[0]) {
        throw new AppError(
          "Free subscription plan not found",
          500,
          "FREE_PLAN_NOT_FOUND",
        );
      }

      const freePlanId = freePlanRes.rows[0].plan_id;

      const insertRes = await client.query(
        `
      INSERT INTO user_subscription
      (user_id, plan_id, start_date, end_date, auto_renew, status, renewal_date)
      VALUES (
        $1,
        $2,
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '7 days',
        false,
        'active',
        NULL
      )
      RETURNING *
      `,
        [userId, freePlanId],
      );

      console.log("INSERTED FREE SUB:", insertRes.rows[0]);

      await client.query("COMMIT");

      return await this.findActiveByUser(userId);
    } catch (error) {
      await client.query("ROLLBACK");
      console.log("createFreeSubscription ERROR:", error);
      throw error;
    } finally {
      client.release();
    }
  }
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
      [id],
    );
    if (!res.rows.length) return null;
    return this._toEntity(res.rows[0]);
  }

  async findLatestByUser(userId) {
    const res = await db.query(
      `
    SELECT
      us.subscription_id,
      us.user_id,
      us.plan_id,
      us.start_date,
      us.end_date,
      us.auto_renew,
      us.status,
      us.renewal_date,
      us.created_at,
      sp.plan_name,
      sp.plan_type
    FROM user_subscription us
    INNER JOIN subscription_plan sp
      ON sp.plan_id = us.plan_id
    WHERE us.user_id = $1
    ORDER BY us.created_at DESC
    LIMIT 1;
    `,
      [userId],
    );

    if (!res.rows.length) return null;

    return this._toEntity(res.rows[0]);
  }

  async findActiveByUser(userId) {
    const res = await db.query(
      `
    SELECT
      us.subscription_id,
      us.user_id,
      us.plan_id,
      us.start_date,
      us.end_date,
      us.auto_renew,
      us.status,
      us.renewal_date,
      us.created_at,
      sp.plan_name,
      sp.plan_type
    FROM user_subscription us
    INNER JOIN subscription_plan sp
      ON sp.plan_id = us.plan_id
    WHERE us.user_id = $1
      AND us.status = 'active'
      AND us.end_date >= CURRENT_DATE
    ORDER BY us.created_at DESC
    LIMIT 1;
  `,
      [userId],
    );

    console.log("findActiveByUser");
    console.log(res.rows[0]);

    if (!res.rows.length) return null;

    return this._toEntity(res.rows[0]);
  }
  _toEntity(row) {
    return new UserSubscription.Builder()
      .setSubscriptionId(row.subscription_id)
      .setUserId(row.user_id)
      .setPlanId(row.plan_id)
      .setPlanName(row.plan_name)
      .setPlanType(row.plan_type)
      .setStartDate(row.start_date)
      .setEndDate(row.end_date)
      .setAutoRenew(row.auto_renew)
      .setStatus(row.status)
      .setRenewalDate(row.renewal_date)
      .setCreatedAt(row.created_at)
      .build();
  }

  async findAllByUser(userId) {
    const sql = `
    SELECT *
    FROM user_subscription
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;

    const { rows } = await db.query(sql, [userId]);
    return rows;
  }

  async findHistoryWithPlan(userId) {
    const sql = `
    SELECT 
      us.subscription_id,
      us.plan_id,
      sp.plan_name,
      sp.plan_type,
      sp.price,
      us.start_date,
      us.end_date,
      us.status,
      us.auto_renew,
      us.renewal_date,
      us.created_at
    FROM user_subscription us
    JOIN subscription_plan sp 
      ON us.plan_id = sp.plan_id
    WHERE us.user_id = $1
    ORDER BY us.created_at DESC
  `;

    const { rows } = await db.query(sql, [userId]);
    return rows; // raw DB rows
  }
}
