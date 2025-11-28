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

//working
router.post("/", authMiddleware, registerDoctor);
//working
router.post("/:id/approve", approveDoctor);
//working
router.post("/:id/reject", rejectDoctor);
//working
router.post("/assign-clinic", authMiddleware, assignDoctorToClinic);

router.get("/doctors", authMiddleware, getDoctors);
router.get("/doctors/:doctorId/clinics", getClinicsOfDoctor);

export default router;
