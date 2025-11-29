import express from "express";
import {
  setAvailability,
  editSchedule,
  deleteSchedule,
  getDoctorSessions,
  checkConflicts,
} from "../controllers/DoctorSessionController.js";

import authMiddleware from "../../../../core/middleware/Auth.js";

const router = express.Router();
//working
router.post("/", authMiddleware, setAvailability);
//working
router.put("/:id", editSchedule);
//working
router.delete("/:id", deleteSchedule);
//working
router.get("/doctor/:doctorId", authMiddleware, getDoctorSessions);
//working
router.post("/check-conflicts", checkConflicts);

export default router;
