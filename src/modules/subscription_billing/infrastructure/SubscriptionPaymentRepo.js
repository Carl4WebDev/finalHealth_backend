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
      [subscriptionId]
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
}
