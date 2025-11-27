import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

import fs from "fs";
import path from "path";

const uploadDirs = [
  "src/core/uploads/lab_results",
  "src/core/uploads/vital_signs",
  "src/core/uploads/certificates",
  "src/core/uploads/referrals",
  "src/core/uploads/prescriptions",
  "src/core/uploads/followup_notes",
  "src/core/uploads/medical_records",
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

//subsystem 1 "User & Role Management"
import userRoutes from "./src/modules/user/interface/routes.js";
app.use("/api/users", userRoutes);

import auditRoutes from "./src/modules/user/interface/auditRoutes.js";
app.use("/api/audit", auditRoutes);

//subsystem 2 "Clinic & Doctor Management"
import clinicRoutes from "./src/modules/clinic_management/interface/routes/clinicRoutes.js";
app.use("/api/clinic-routes", clinicRoutes);

import doctorRoutes from "./src/modules/clinic_management/interface/routes/doctorRoutes.js";
app.use("/api/doctor-routes", doctorRoutes);

import doctorSessionRoutes from "./src/modules/clinic_management/interface/routes/doctorSessionRoutes.js";
app.use("/api/doctor-session-routes", doctorSessionRoutes);

import queueRoutes from "./src/modules/patient_appointment_management/interface/routes/queueRoutes.js";
app.use("/api/queue-routes", queueRoutes);

//subsystem 3 "Patient & Appointment Management"
import patientRoutes from "./src/modules/patient_appointment_management/interface/routes/patientRoutes.js";
app.use("/api/patient-routes", patientRoutes);

import appointmentRoutes from "./src/modules/patient_appointment_management/interface/routes/appointmentRoutes.js";
app.use("/api/appointment-routes", appointmentRoutes);

//subsystem 4 "Medical Records Management"
import labResultRoutes from "./src/modules/medical_records_management/interface/routes/labResultRoutes.js";
app.use("/api/lab-result-routes", labResultRoutes);

import certificateRoutes from "./src/modules/medical_records_management/interface/routes/certificateRoutes.js";
app.use("/api/certificate-routes", certificateRoutes);

import vitalSignsRoutes from "./src/modules/medical_records_management/interface/routes/vitalSignsRoutes.js";
app.use("/api/vital-signs-routes", vitalSignsRoutes);

import referralRecordRoutes from "./src/modules/medical_records_management/interface/routes/referralRecordRoutes.js";
app.use("/api/referral-record-routes", referralRecordRoutes);

import prescriptionRoutes from "./src/modules/medical_records_management/interface/routes/prescriptionRoutes.js";
app.use("/api/prescription-routes", prescriptionRoutes);

import followupNoteRoutes from "./src/modules/medical_records_management/interface/routes/followupNoteRoutes.js";
app.use("/api/followup-note-routes", followupNoteRoutes);

import medicalRecordRoutes from "./src/modules/medical_records_management/interface/routes/medicalRecordRoutes.js";
app.use("/api/medical-record-routes", medicalRecordRoutes);

import medicalRecordDocumentRoutes from "./src/modules/medical_records_management/interface/routes/medicalRecordDocumentRoutes.js";
app.use("/api/medical-record-document-routes", medicalRecordDocumentRoutes);

//subsystem 5 "Notification subsystem"
import notificationRoutes from "./src/modules/notification/interface/routes/notificationRoutes.js";
app.use("/api/notification-routes", notificationRoutes);

//subsystem 6 "Subscription & Billing Subsystem"
import subscriptoinRoutes from "./src/modules/subscription_billing/interface/routes/subscriptionRoutes.js";
app.use("/api/subscription-routes", subscriptoinRoutes);

// Serve profile images
app.use(
  "/uploads/profile",
  express.static(path.join(process.cwd(), "uploads/profile"))
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 FinalHealth backend running on port ${PORT}`)
);
