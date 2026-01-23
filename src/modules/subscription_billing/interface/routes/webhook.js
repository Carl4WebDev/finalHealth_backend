import express from "express";
import Stripe from "stripe";
import db from "../../../../core/database/db.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Stripe Webhook Endpoint
 * IMPORTANT:
 * - Must use express.raw() to preserve the raw body for signature verification
 */
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    /**
     * 1️⃣ Verify Stripe signature
     * This ensures the request genuinely came from Stripe
     */
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send("Invalid signature");
    }

    /**
     * ===============================
     * PAYMENT SUCCESS HANDLER
     * ===============================
     */
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;

      // Extract required data from Stripe metadata
      const stripePaymentIntentId = pi.id;
      const userId = Number(pi.metadata.userId);
      const planId = Number(pi.metadata.planId);
      const amount = pi.amount / 100; // cents → PHP
      const paymentMethod = "stripe";

      try {
        /**
         * 2️⃣ Start DB transaction
         * Ensures atomicity (all-or-nothing)
         */
        await db.query("BEGIN");

        /**
         * 3️⃣ Idempotency check
         * Prevents duplicate processing if Stripe retries webhook
         */
        const exists = await db.query(
          `SELECT payment_id
           FROM subscription_payment
           WHERE stripe_payment_intent_id = $1`,
          [stripePaymentIntentId]
        );

        if (exists.rows.length > 0) {
          await db.query("ROLLBACK");
          return res.json({ received: true });
        }

        /**
         * 4️⃣ Fetch plan type
         * Used to compute subscription duration
         */
        const planRes = await db.query(
          `SELECT plan_type
           FROM subscription_plan
           WHERE plan_id = $1`,
          [planId]
        );

        if (!planRes.rows.length) {
          throw new Error("Invalid plan in webhook");
        }

        const planType = planRes.rows[0].plan_type;

        /**
         * 5️⃣ Compute subscription dates
         */
        const startDate = new Date();
        let endDate = new Date(startDate);

        if (planType === "free") endDate.setDate(endDate.getDate() + 7);
        if (planType === "monthly") endDate.setMonth(endDate.getMonth() + 1);
        if (planType === "yearly")
          endDate.setFullYear(endDate.getFullYear() + 1);

        /**
         * 6️⃣ Expire existing active subscription (if any)
         * Ensures only ONE active subscription per user
         */
        await db.query(
          `UPDATE user_subscription
   SET status = 'expired'
   WHERE user_id = $1 AND status = 'active'`,
          [userId]
        );
        /**
         * 7️⃣ Insert new subscription record
         * Each payment creates a new immutable subscription
         */
        const subRes = await db.query(
          `INSERT INTO user_subscription (
    user_id, plan_id, start_date, end_date, auto_renew, status
  )
  VALUES ($1, $2, $3, $4, TRUE, 'active')
  RETURNING subscription_id`,
          [userId, planId, startDate, endDate]
        );

        const subscriptionId = subRes.rows[0].subscription_id;

        /**
         * 7️⃣ Insert payment record
         * This is the financial audit trail
         */
        await db.query(
          `INSERT INTO subscription_payment (
            subscription_id,
            amount,
            payment_method,
            transaction_id,
            stripe_payment_intent_id,
            status
          )
          VALUES ($1, $2, $3, $4, $5, 'paid')`,
          [
            subscriptionId,
            amount,
            paymentMethod,
            stripePaymentIntentId,
            stripePaymentIntentId,
          ]
        );

        /**
         * 8️⃣ Commit transaction
         */
        await db.query("COMMIT");
        console.log("Stripe payment processed:", stripePaymentIntentId);
      } catch (err) {
        await db.query("ROLLBACK");
        console.error("Webhook DB error:", err);
        return res.status(500).send("Webhook processing failed");
      }
    }

    /**
     * ===============================
     * PAYMENT FAILED HANDLER
     * ===============================
     * IMPORTANT:
     * - Records failed attempts
     * - Prevents silent failures
     */
    if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object;

      try {
        await db.query(
          `INSERT INTO subscription_payment (
            subscription_id,
            amount,
            payment_method,
            transaction_id,
            stripe_payment_intent_id,
            status
          )
          VALUES (NULL, $1, 'stripe', $2, $2, 'failed')`,
          [pi.amount / 100, pi.id]
        );

        console.log("Stripe payment failed:", pi.id);
      } catch (err) {
        console.error("Failed payment logging error:", err);
      }
    }

    /**
     * Stripe requires a 200 response
     * Anything else = retry
     */
    res.json({ received: true });
  }
);

export default router;
