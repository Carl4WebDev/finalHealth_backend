import express from "express";
import {
  addToQueue,
  getQueueOfDoctorInClinic,
  updateQueueStatus,
} from "../controllers/QueueController.js";

import authMiddleware from "../../../../core/middleware/Auth.js";
import { requireUser } from "../../../../core/middleware/requireUser.js";
const router = express.Router();

router.post("/", authMiddleware, requireUser, addToQueue);

router.get(
  "/doctor/:doctorId/clinic/:clinicId",
  authMiddleware,
  requireUser,
  getQueueOfDoctorInClinic
);

router.put(
  "/queue-entry/:queueId/status",
  authMiddleware,
  requireUser,
  updateQueueStatus
);

export default router;
