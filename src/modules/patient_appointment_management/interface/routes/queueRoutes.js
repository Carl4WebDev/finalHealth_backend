import express from "express";
import {
  addToQueue,
  getQueue,
  updateQueueStatus,
} from "../controllers/QueueController.js";

import authMiddleware from "../../../../core/middleware/auth.js";

const router = express.Router();
router.post("/", authMiddleware, addToQueue);
router.get("/doctor/:doctorId/clinic/:clinicId", authMiddleware, getQueue);
router.put("/:id/status", authMiddleware, updateQueueStatus);

export default router;
