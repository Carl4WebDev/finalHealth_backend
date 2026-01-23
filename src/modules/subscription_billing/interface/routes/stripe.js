router.post(
  "/webhooks/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      return res.status(400).send("Invalid signature");
    }

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;

      const userId = Number(intent.metadata.userId);
      const planId = Number(intent.metadata.planId);

      // 1. Create user_subscription
      const start = new Date();
      const end = new Date(start);

      if (planId === 2) end.setMonth(end.getMonth() + 1);
      if (planId === 3) end.setFullYear(end.getFullYear() + 1);

      const subscription = await db.user_subscription.create({
        user_id: userId,
        plan_id: planId,
        start_date: start,
        end_date: end,
        status: "active",
        auto_renew: false,
      });

      // 2. Record payment
      await db.subscription_payment.create({
        subscription_id: subscription.subscription_id,
        amount: intent.amount / 100,
        payment_method: "card", // hardcode for now
        transaction_id: intent.id, // REAL Stripe ID
        status: "paid",
        payment_date: new Date(),
      });
    }

    res.json({ received: true });
  },
);
