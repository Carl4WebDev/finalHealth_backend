import express from "express";
import {
  registerDoctor,
  approveDoctor,
  rejectDoctor,
  assignDoctorToClinic,
  getDoctors,
  getClinicsOfDoctor,
} from "../controllers/DoctorController.js";

const router = express.Router();

import authMiddleware from "../../../../core/middleware/Auth.js";
import { requireUser } from "../../../../core/middleware/requireUser.js";
import { requireAdmin } from "../../../../core/middleware/requireAdmin.js";

router.post("/", authMiddleware, requireUser, registerDoctor);

router.post(
  "/assign-clinic",
  authMiddleware,
  requireUser,
  assignDoctorToClinic
);

router.post("/doctor/:id/approve", authMiddleware, requireAdmin, approveDoctor);
router.post("/doctor/:id/reject", authMiddleware, requireAdmin, rejectDoctor);

router.get("/doctors", authMiddleware, getDoctors);
router.get("/doctors/:doctorId/clinics", authMiddleware, getClinicsOfDoctor);

export default router;
