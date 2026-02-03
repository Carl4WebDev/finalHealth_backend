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

export default router;
