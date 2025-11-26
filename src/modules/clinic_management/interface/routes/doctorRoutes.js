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



//working
router.post("/", registerDoctor);
//working
router.post("/:id/approve", approveDoctor);
//working
router.post("/:id/reject", rejectDoctor);
//working
router.post("/:id/assign-clinic", assignDoctorToClinic);

router.get("/doctors", getDoctors);
router.get("/doctors/:doctorId/clinics", getClinicsOfDoctor);

export default router;
