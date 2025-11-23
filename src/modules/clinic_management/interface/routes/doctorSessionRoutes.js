import express from "express";
import {
  setAvailability,
  editSchedule,
  deleteSchedule,
  getDoctorSessions,
  checkConflicts,
} from "../controllers/DoctorSessionController.js";

const router = express.Router();
//working
router.post("/", setAvailability);
//working
router.put("/:id", editSchedule);
//working
router.delete("/:id", deleteSchedule);
//working
router.get("/doctor/:doctorId", getDoctorSessions);
//working
router.post("/check-conflicts", checkConflicts);

export default router;
