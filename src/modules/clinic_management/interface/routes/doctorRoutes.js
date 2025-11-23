import express from "express";
import {
  registerDoctor,
  approveDoctor,
  rejectDoctor,
  assignDoctorToClinic,
} from "../controllers/DoctorController.js";

const router = express.Router();

//working
router.post("/", registerDoctor);
//working
router.post("/:id/approve", approveDoctor);
//working
router.post("/:id/reject", rejectDoctor);
//working
router.post("/:id/assign-clinic", assignDoctorToClinic);

export default router;
