import express from "express";
import {
  getDashboardOverview,
  getDashboardUsage,
} from "./controllers/DashboardController.js";

const router = express.Router();

import authMiddleware from "../../../core/middleware/Auth.js";
import { requireUser } from "../../../core/middleware/requireUser.js";

router.get("/overview", authMiddleware, requireUser, getDashboardOverview);
router.get("/usage", authMiddleware, requireUser, getDashboardUsage);

export default router;
