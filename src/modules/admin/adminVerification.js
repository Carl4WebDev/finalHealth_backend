import express from "express";
import db from "../../core/database/db.js";
import authMiddleware from "../../core/middleware/Auth.js";

const router = express.Router();

// GET all doctors & clinics pending verification
router.get("/verification-list", authMiddleware, async (req, res) => {
  try {
    // PENDING DOCTORS
    const doctorsQuery = `
      SELECT 
        d.doctor_id AS id,
        CONCAT(d.f_name, ' ', d.l_name) AS name,
        d.specialization,
        d.license_number,
        d.gender,
        d.address,
        d.verification_status,
        d.created_at,
        'doctor' AS type
      FROM doctors d
      WHERE d.verification_status = 'Pending';
    `;

    const clinicsQuery = `
      SELECT
        c.clinic_id AS id,
        c.clinic_name AS name,
        c.address,
        c.contact_num AS contact,
        c.owner_name,
        c.verification_status,
        c.created_at,
        'clinic' AS type
      FROM clinics c
      WHERE c.verification_status = 'Pending';
    `;

    const doctors = (await db.query(doctorsQuery)).rows;
    const clinics = (await db.query(clinicsQuery)).rows;

    res.json({
      success: true,
      data: [...doctors, ...clinics], // Merge both
    });
  } catch (err) {
    console.error("Verification list error:", err);
    res.json({ success: false, error: "Failed loading verification list" });
  }
});

export default router;
