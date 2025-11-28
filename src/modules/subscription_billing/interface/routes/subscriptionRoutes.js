import express from "express";
import {
  listPlans,
  subscribeToPlan,
  getMyActiveSubscription,
  cancelMySubscription,
} from "../controllers/SubscriptionController.js";

import authMiddleware from "../../../../core/middleware/Auth.js";

const router = express.Router();

// All routes assume some auth middleware ran before them
router.get("/plans", authMiddleware, listPlans);
router.post("/subscribe", authMiddleware, subscribeToPlan);
router.get("/me", authMiddleware, getMyActiveSubscription);
router.post("/cancel", authMiddleware, cancelMySubscription);

export default router;
