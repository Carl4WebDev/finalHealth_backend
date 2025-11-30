import express from "express";
import db from "../../../../../core/database/db.js"; // Assuming db is connected here
import dotenv from "dotenv";
import authMiddleware from "../../../../../core/middleware/Auth.js"; // Authentication middleware

dotenv.config(); // Load environment variables

const router = express.Router();

// =============================
// GET MEDICAL HISTORY
// =============================

router.get("/:patientId", async (req, res) => {
  const patientId = Number(req.params.patientId);

  try {
    const query = `
      SELECT mr.*
      FROM medical_records mr
      WHERE mr.patient_id = $1
      ORDER BY mr.created_at DESC;
    `;
    const result = await db.query(query, [patientId]);

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No medical records found for this patient",
      });
    }

    // Send medical history records
    res.status(200).json({
      success: true,
      medicalHistory: result.rows,
    });
  } catch (err) {
    console.error("Error fetching medical history:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// =============================
// ADD MEDICAL RECORD
// =============================

router.post("/:patientId", authMiddleware, async (req, res) => {
  const { patientId } = req.params;
  const {
    diagnosis,
    treatment,
    medications,
    assessment,
    is_contagious,
    contagious_description,
    record_date,
  } = req.body;

  console.log("Received body:", req.body); // Log request body for debugging

  // Validate required fields
  if (!diagnosis || !treatment || !medications || !assessment || !record_date) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // Validate record_date format
  const formattedRecordDate = new Date(record_date);
  if (isNaN(formattedRecordDate.getTime())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid record_date format" });
  }

  try {
    // Insert into the medical_records table
    const query = `
      INSERT INTO medical_records
      (patient_id, diagnosis, treatment, medications, assessment, is_contagious, contagious_description, record_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      patientId,
      diagnosis,
      treatment,
      medications,
      assessment,
      is_contagious,
      contagious_description,
      formattedRecordDate.toISOString().split("T")[0], // Format date (YYYY-MM-DD)
    ];

    const result = await db.query(query, values);
    const record = result.rows[0];

    res.status(201).json({
      success: true,
      message: "Medical record added successfully",
      record: record,
    });
  } catch (err) {
    console.error("Error adding medical record:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// =============================
// UPDATE MEDICAL RECORD
// =============================

router.put("/:recordId", async (req, res) => {
  const { recordId } = req.params;
  const {
    diagnosis,
    treatment,
    medications,
    assessment,
    is_contagious,
    contagious_description,
    record_date,
  } = req.body;

  // Validate required fields
  if (!diagnosis || !treatment || !medications || !assessment || !record_date) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // Validate record_date format
  const formattedRecordDate = new Date(record_date);
  if (isNaN(formattedRecordDate.getTime())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid record_date format" });
  }

  try {
    // Update the medical record
    const query = `
      UPDATE medical_records
      SET diagnosis = $1,
          treatment = $2,
          medications = $3,
          assessment = $4,
          is_contagious = $5,
          contagious_description = $6,
          record_date = $7
      WHERE record_id = $8
      RETURNING *;
    `;
    const values = [
      diagnosis,
      treatment,
      medications,
      assessment,
      is_contagious,
      contagious_description,
      formattedRecordDate.toISOString().split("T")[0], // Send the formatted date (YYYY-MM-DD)
      recordId,
    ];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    const updatedRecord = result.rows[0];

    res.status(200).json({
      success: true,
      message: "Medical record updated successfully",
      record: updatedRecord,
    });
  } catch (err) {
    console.error("Error updating medical record:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
