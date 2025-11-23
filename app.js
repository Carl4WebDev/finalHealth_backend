import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

//subsystem 1 "User & Role Management"
import userRoutes from "./src/modules/user/interface/routes.js";
app.use("/api/users", userRoutes);

//subsystem 2 "Clinic & Doctor Management"
import clinicRoutes from "./src/modules/clinic_management/interface/routes/clinicRoutes.js";
app.use("/api/clinic-routes", clinicRoutes);

import doctorRoutes from "./src/modules/clinic_management/interface/routes/doctorRoutes.js";
app.use("/api/doctor-routes", doctorRoutes);

import doctorSessionRoutes from "./src/modules/clinic_management/interface/routes/doctorSessionRoutes.js";
app.use("/api/doctor-session-routes", doctorSessionRoutes);

//subsystem 3 "Patient & Appointment Management"
import patientRoutes from "./src/modules/patient_appointment_management/interface/routes/patientRoutes.js";
app.use("/api/patient-routes", patientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 FinalHealth backend running on port ${PORT}`)
);
