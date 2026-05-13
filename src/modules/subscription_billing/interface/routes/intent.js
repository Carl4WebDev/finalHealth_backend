import express from "express";
import { stripe } from "../../infrastructure/stripe.client.js";
import db from "../../../../core/database/db.js";
import authMiddleware from "../../../../core/middleware/Auth.js";

const router = express.Router();

router.post("/payments/intent", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ error: "planId is required" });
    }

    // 1️⃣ Fetch plan securely from DB
    const result = await db.query(
      `SELECT plan_id, price 
       FROM subscription_plan 
       WHERE plan_id = $1 AND isactive = TRUE`,
      [planId],
    );

    if (!result.rows.length) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const plan = result.rows[0];

    // 2️⃣ Create Stripe PaymentIntent (CLI-compatible)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(plan.price) * 100), // cents
      currency: "php",

      // 🔥 IMPORTANT FIX
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },

      metadata: {
        userId: String(userId),
        planId: String(plan.plan_id),
      },
    });

    // 3️⃣ Return client secret to caller
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe PaymentIntent error:", err);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});
router.post("/payments/activate", authMiddleware, async (req, res) => {
  const client = await db.getClient();

  try {
    const userId = req.user.id;
    const { planId, paymentIntentId, paymentMethod } = req.body;

    if (!planId || !paymentIntentId) {
      return res.status(400).json({
        status: "error",
        message: "planId and paymentIntentId are required",
      });
    }

    await client.query("BEGIN");

    const planResult = await client.query(
      `
      SELECT plan_id, plan_name, plan_type, price
      FROM subscription_plan
      WHERE plan_id = $1 AND isactive = TRUE
      `,
      [planId],
    );

    if (!planResult.rows.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        status: "error",
        message: "Invalid plan",
      });
    }

    const plan = planResult.rows[0];

    await client.query(
      `
      UPDATE user_subscription
      SET status = 'cancelled'
      WHERE user_id = $1
      AND status = 'active'
      `,
      [userId],
    );

    const startDate = new Date();

    const endDate = new Date(startDate);

    if (plan.plan_type === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan.plan_type === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setDate(endDate.getDate() + 7);
    }

    const subResult = await client.query(
      `
      INSERT INTO user_subscription
        (user_id, plan_id, start_date, end_date, auto_renew, status, renewal_date)
      VALUES
        ($1, $2, $3, $4, false, 'active', NULL)
      RETURNING *
      `,
      [userId, plan.plan_id, startDate, endDate],
    );

    const subscription = subResult.rows[0];

    const finalPaymentMethod = "stripe";

    await client.query(
      `
  INSERT INTO subscription_payment
    (subscription_id, amount, payment_method, transaction_id, status)
  VALUES
    ($1, $2, $3, $4, 'paid')
  `,
      [
        subscription.subscription_id,
        plan.price,
        finalPaymentMethod,
        paymentIntentId,
      ],
    );
    await client.query("COMMIT");

    return res.status(201).json({
      status: "success",
      message: "Subscription activated successfully",
      data: {
        subscription,
        plan,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Activate subscription error:", err);

    return res.status(500).json({
      status: "error",
      message: "Failed to activate subscription",
    });
  } finally {
    client.release();
  }
});

export default router;
