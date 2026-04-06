import ISubscriptionPaymentRepository from "../domain/repositories/ISubscriptionPaymentRepository.js";
import SubscriptionPayment from "../domain/entities/SubscriptionPayment.js";
import db from "../../../core/database/db.js";

export default class SubscriptionPaymentRepo extends ISubscriptionPaymentRepository {
  async save(payment) {
    const query = `
      INSERT INTO subscription_payment
      (subscription_id, amount, payment_method, transaction_id, status)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
    `;
    const values = [
      payment.subscriptionId,
      payment.amount,
      payment.paymentMethod,
      payment.transactionId,
      payment.status,
    ];

    const res = await db.query(query, values);
    return this._toEntity(res.rows[0]);
  }

  async listBySubscription(subscriptionId) {
    const res = await db.query(
      `
      SELECT * FROM subscription_payment
      WHERE subscription_id = $1
      ORDER BY payment_date DESC;
      `,
      [subscriptionId],
    );
    return res.rows.map((r) => this._toEntity(r));
  }

  _toEntity(row) {
    return new SubscriptionPayment.Builder()
      .setPaymentId(row.payment_id)
      .setSubscriptionId(row.subscription_id)
      .setAmount(Number(row.amount))
      .setPaymentMethod(row.payment_method)
      .setTransactionId(row.transaction_id)
      .setPaymentDate(row.payment_date)
      .setStatus(row.status)
      .build();
  }

  async findByUser(userId) {
    const sql = `
    SELECT sp.*
    FROM subscription_payment sp
    JOIN user_subscription us
      ON sp.subscription_id = us.subscription_id
    WHERE us.user_id = $1
    ORDER BY sp.payment_date DESC
  `;

    const { rows } = await db.query(sql, [userId]);

    return rows.map((r) => ({
      paymentId: r.payment_id,
      subscriptionId: r.subscription_id,
      amount: r.amount,
      paymentMethod: r.payment_method,
      transactionId: r.transaction_id,
      paymentDate: r.payment_date,
      status: r.status,
    }));
  }
}
