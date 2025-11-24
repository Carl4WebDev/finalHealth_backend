import express from "express";
import {
  listPlans,
  subscribeToPlan,
  getMyActiveSubscription,
} from "../controllers/SubscriptionController.js";

const router = express.Router();

// All routes assume some auth middleware ran before them
router.get("/plans", listPlans);
router.post("/subscribe", subscribeToPlan);
router.get("/me", getMyActiveSubscription);

export default router;
