import express from "express";
import {
  setAvailability,
  editSchedule,
  deleteSchedule,
  getDoctorSessions,
  checkConflicts,
} from "../controllers/DoctorSessionController.js";

import authMiddleware from "../../../../core/middleware/Auth.js";
import { requireUser } from "../../../../core/middleware/requireUser.js";

const router = express.Router();
router.post("/", authMiddleware, requireUser, setAvailability);
router.put("/session/:id", authMiddleware, requireUser, editSchedule);
router.delete("/session/:id", authMiddleware, requireUser, deleteSchedule);
router.get("/doctor/:doctorId", authMiddleware, requireUser, getDoctorSessions);
router.post("/check-conflicts", checkConflicts);

export default router;
