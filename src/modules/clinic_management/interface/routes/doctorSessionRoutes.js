import express from "express";
import {
  createDoctorSession,
  editSchedule,
  deleteSession,
  getAllDoctorSessions,
  checkConflicts,
  getDoctorScheduleInClinic,
} from "../controllers/DoctorSessionController.js";

import authMiddleware from "../../../../core/middleware/Auth.js";
import { requireUser } from "../../../../core/middleware/requireUser.js";

const router = express.Router();
router.post("/", authMiddleware, requireUser, createDoctorSession);

router.put("/session/:id", authMiddleware, requireUser, editSchedule);

router.delete(
  "/session/:sessionId/delete",
  authMiddleware,
  requireUser,
  deleteSession
);

router.get(
  "/doctor/:doctorId/sessions",
  authMiddleware,
  requireUser,
  getAllDoctorSessions
);

router.post("/check-conflicts", checkConflicts);

// ============================================================
// New & Updated APIs
// ============================================================
router.get(
  "/doctor/:doctorId/clinic/:clinicId/sessions",
  authMiddleware,
  requireUser,
  getDoctorScheduleInClinic
);

export default router;
