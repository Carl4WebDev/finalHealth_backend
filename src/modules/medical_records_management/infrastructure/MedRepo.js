import db from "../../../core/database/db.js";

export default class MedRepo {
  async countMedicalRecordsByPatient(patientId) {
    const result = await db.query(
      `
      SELECT COUNT(*)::int AS total
      FROM medical_records
      WHERE patient_id = $1
    `,
      [patientId],
    );

    return result.rows[0]?.total || 0;
  }

  async getPatientOfDoctorInClinic(doctorId, clinicId, userId) {
    const query = `
    SELECT
      p.patient_id,
      CONCAT(p.f_name, ' ', p.l_name) AS full_name,
      p.gender,
      DATE_PART('year', AGE(p.date_of_birth)) AS age
    FROM doctor_patient_clinic dpc
    JOIN patients p
      ON p.patient_id = dpc.patient_id
    JOIN doctors d
      ON d.doctor_id = dpc.doctor_id
    WHERE dpc.doctor_id = $1
      AND dpc.clinic_id = $2
      AND d.user_id = $3
    ORDER BY p.l_name, p.f_name;
  `;

    const { rows } = await db.query(query, [doctorId, clinicId, userId]);

    return rows;
  }

  async getPatientInfo(patientId) {
    const query = `
      SELECT
        p.patient_id,
        CONCAT(p.f_name, ' ', p.m_name, ' ', p.l_name) AS full_name,
        p.gender,
        p.date_of_birth,
        p.contact_number,
        p.backup_contact,
        p.email,
        p.address,
        p.priority_id,
        pq.priority_level,
        pq.description AS priority_description,
        pq.priority_rank,
        p.patient_type_id,
        p.created_at
      FROM patients p
      LEFT JOIN priority_queue pq
        ON pq.priority_id = p.priority_id
      WHERE p.patient_id = $1
      LIMIT 1;
    `;

    const { rows } = await db.query(query, [patientId]);
    return rows[0];
  }

  async getPatientMedicalRecords(patientId) {
    // 1. Get the medical record (ROOT)
    const recordQuery = `
    SELECT * FROM medical_records
    WHERE patient_id = $1
  `;

    const { rows } = await db.query(recordQuery, [patientId]);
    return rows;
  }

  async getMedicalRecordsFullDetails(recordId) {
    const recordQuery = `
    SELECT
      mr.record_id,
      mr.appointment_id,
      mr.patient_id,
      mr.record_date,
      mr.diagnosis,
      mr.treatment,
      mr.medications,
      mr.assessment,
      mr.is_contagious,
      mr.contagious_description,
      mr.consultation_fee,
      mr.medicine_fee,
      mr.lab_fee,
      mr.other_fee,
      mr.total_amount,
      mr.doctor_id,
      mr.clinic_id,
      mr.form_type,
      mr.pre_employment_data,
      mr.created_at,
      d.f_name || ' ' || d.l_name AS doctor_name,
      c.clinic_name
    FROM medical_records mr
    JOIN doctors d ON d.doctor_id = mr.doctor_id
    JOIN clinics c ON c.clinic_id = mr.clinic_id
    WHERE mr.record_id = $1
  `;

    const recordRes = await db.query(recordQuery, [recordId]);

    if (recordRes.rows.length === 0) {
      return null;
    }

    const medicalRecord = recordRes.rows[0];

    const [
      vitalSigns,
      prescriptions,
      labResults,
      referrals,
      followups,
      certificates,
      documents,
    ] = await Promise.all([
      db.query(`SELECT * FROM vital_signs WHERE medical_record_id = $1`, [
        recordId,
      ]),
      db.query(`SELECT * FROM prescription WHERE medical_record_id = $1`, [
        recordId,
      ]),
      db.query(`SELECT * FROM lab_result WHERE medical_record_id = $1`, [
        recordId,
      ]),
      db.query(`SELECT * FROM referral_records WHERE medical_record_id = $1`, [
        recordId,
      ]),
      db.query(`SELECT * FROM followup_notes WHERE medical_record_id = $1`, [
        recordId,
      ]),
      db.query(`SELECT * FROM certificates WHERE medical_record_id = $1`, [
        recordId,
      ]),
      db.query(
        `
      SELECT document_id, document_img_path, uploaded_at, uploaded_by
      FROM medical_record_documents
      WHERE record_id = $1
      ORDER BY uploaded_at DESC
      `,
        [recordId],
      ),
    ]);

    return {
      medicalRecord: {
        ...medicalRecord,
        pre_employment_data: medicalRecord.pre_employment_data || null,
      },
      vitalSigns: vitalSigns.rows,
      prescriptions: prescriptions.rows,
      labResults: labResults.rows,
      referrals: referrals.rows,
      followups: followups.rows,
      certificates: certificates.rows,
      documents: documents.rows,
    };
  }
  async createFullMedicalRecord(data) {
    const client = await db.getClient();

    try {
      await client.query("BEGIN");

      const consultationFee = Number(data.consultation_fee || 0);
      const medicineFee = Number(data.medicine_fee || 0);
      const labFee = Number(data.lab_fee || 0);
      const otherFee = Number(data.other_fee || 0);

      const totalAmount = consultationFee + medicineFee + labFee + otherFee;

      const recordRes = await client.query(
        `
      INSERT INTO medical_records
      (
        appointment_id,
        patient_id,
        record_date,
        diagnosis,
        treatment,
        medications,
        assessment,
        is_contagious,
        contagious_description,
        consultation_fee,
        medicine_fee,
        lab_fee,
        other_fee,
        total_amount,
        doctor_id,
        clinic_id,
        form_type,
        pre_employment_data
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
      RETURNING
        record_id,
        appointment_id,
        patient_id,
        record_date,
        diagnosis,
        treatment,
        medications,
        assessment,
        is_contagious,
        contagious_description,
        consultation_fee,
        medicine_fee,
        lab_fee,
        other_fee,
        total_amount,
        doctor_id,
        clinic_id,
        form_type,
        pre_employment_data,
        created_at;
      `,
        [
          data.appointment_id,
          data.patientId,
          data.record_date,
          data.diagnosis,
          data.treatment,
          data.medications,
          data.assessment,
          data.is_contagious,
          data.contagious_description,
          consultationFee,
          medicineFee,
          labFee,
          otherFee,
          totalAmount,
          data.doctor_id,
          data.clinic_id,
          data.form_type || "general",
          data.pre_employment_data,
        ],
      );

      await client.query("COMMIT");

      return recordRes.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
  async insertDocuments(docs) {
    const query = `
    INSERT INTO medical_record_documents
    (record_id, document_img_path, uploaded_by)
    VALUES ($1, $2, $3)
  `;

    for (const d of docs) {
      await db.query(query, [d.recordId, d.path, d.uploadedBy]);
    }
  }

  async findById(recordId) {
    const res = await db.query(
      `SELECT record_id FROM medical_records WHERE record_id = $1`,
      [recordId],
    );
    return res.rows[0];
  }

  // Diagnosis
  async getAllDiagnoses(userId) {
    const res = await db.query(
      `
    SELECT
      diagnosis_id,
      diagnosis_name,
      created_at
    FROM diagnosis_master
    WHERE user_id = $1
    ORDER BY diagnosis_name ASC
    `,
      [userId],
    );

    return res.rows;
  }

  async createDiagnosis(userId, diagnosisName) {
    const res = await db.query(
      `
    INSERT INTO diagnosis_master (user_id, diagnosis_name)
    VALUES ($1, $2)
    RETURNING diagnosis_id, diagnosis_name, created_at
    `,
      [userId, diagnosisName],
    );

    return res.rows[0];
  }

  async updateDiagnosis(userId, diagnosisId, diagnosisName) {
    const res = await db.query(
      `
    UPDATE diagnosis_master
    SET diagnosis_name = $1
    WHERE diagnosis_id = $2 AND user_id = $3
    RETURNING diagnosis_id, diagnosis_name, created_at
    `,
      [diagnosisName, diagnosisId, userId],
    );

    return res.rows[0] || null;
  }

  async deleteDiagnosis(userId, diagnosisId) {
    const res = await db.query(
      `
    DELETE FROM diagnosis_master
    WHERE diagnosis_id = $1 AND user_id = $2
    RETURNING diagnosis_id
    `,
      [diagnosisId, userId],
    );

    return res.rows[0] || null;
  }

  async getAllTreatments(userId) {
    const res = await db.query(
      `
    SELECT
      treatment_id,
      treatment_name,
      created_at
    FROM treatment_master
    WHERE user_id = $1
    ORDER BY treatment_name ASC
    `,
      [userId],
    );

    return res.rows;
  }

  async createTreatment(userId, treatmentName) {
    const res = await db.query(
      `
    INSERT INTO treatment_master (user_id, treatment_name)
    VALUES ($1, $2)
    RETURNING treatment_id, treatment_name, created_at
    `,
      [userId, treatmentName],
    );

    return res.rows[0];
  }

  async updateTreatment(userId, treatmentId, treatmentName) {
    const res = await db.query(
      `
    UPDATE treatment_master
    SET treatment_name = $1
    WHERE treatment_id = $2 AND user_id = $3
    RETURNING treatment_id, treatment_name, created_at
    `,
      [treatmentName, treatmentId, userId],
    );

    return res.rows[0] || null;
  }

  async deleteTreatment(userId, treatmentId) {
    const res = await db.query(
      `
    DELETE FROM treatment_master
    WHERE treatment_id = $1 AND user_id = $2
    RETURNING treatment_id
    `,
      [treatmentId, userId],
    );

    return res.rows[0] || null;
  }

  // Vital Signs
  async getAllVitalSignsByPatient(patientId) {
    const res = await db.query(
      `
      SELECT
        vital_id,
        appointment_id,
        patient_id,
        blood_pressure,
        heart_rate,
        temperature,
        oxygen_saturation,
        weight,
        vital_img_path,
        created_at,
        medical_record_id
      FROM vital_signs
      WHERE patient_id = $1
      ORDER BY created_at DESC, vital_id DESC
      `,
      [patientId],
    );

    return res.rows;
  }

  async getVitalSignById(vitalId) {
    const res = await db.query(
      `
      SELECT
        vital_id,
        appointment_id,
        patient_id,
        blood_pressure,
        heart_rate,
        temperature,
        oxygen_saturation,
        weight,
        vital_img_path,
        created_at,
        medical_record_id
      FROM vital_signs
      WHERE vital_id = $1
      LIMIT 1
      `,
      [vitalId],
    );

    return res.rows[0] || null;
  }

  async createVitalSign(data) {
    const res = await db.query(
      `
      INSERT INTO vital_signs
      (
        appointment_id,
        patient_id,
        blood_pressure,
        heart_rate,
        temperature,
        oxygen_saturation,
        weight,
        vital_img_path,
        medical_record_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING
        vital_id,
        appointment_id,
        patient_id,
        blood_pressure,
        heart_rate,
        temperature,
        oxygen_saturation,
        weight,
        vital_img_path,
        created_at,
        medical_record_id
      `,
      [
        data.appointmentId,
        data.patientId,
        data.bloodPressure,
        data.heartRate,
        data.temperature,
        data.oxygenSaturation,
        data.weight,
        data.vitalImgPath,
        data.medicalRecordId,
      ],
    );

    return res.rows[0];
  }

  async updateVitalSign(vitalId, data) {
    const res = await db.query(
      `
      UPDATE vital_signs
      SET
        appointment_id = $1,
        patient_id = $2,
        blood_pressure = $3,
        heart_rate = $4,
        temperature = $5,
        oxygen_saturation = $6,
        weight = $7,
        vital_img_path = $8,
        medical_record_id = $9
      WHERE vital_id = $10
      RETURNING
        vital_id,
        appointment_id,
        patient_id,
        blood_pressure,
        heart_rate,
        temperature,
        oxygen_saturation,
        weight,
        vital_img_path,
        created_at,
        medical_record_id
      `,
      [
        data.appointmentId,
        data.patientId,
        data.bloodPressure,
        data.heartRate,
        data.temperature,
        data.oxygenSaturation,
        data.weight,
        data.vitalImgPath,
        data.medicalRecordId,
        vitalId,
      ],
    );

    return res.rows[0] || null;
  }

  async deleteVitalSign(vitalId) {
    const res = await db.query(
      `
      DELETE FROM vital_signs
      WHERE vital_id = $1
      RETURNING vital_id
      `,
      [vitalId],
    );

    return res.rows[0] || null;
  }

  async getPatientVisitHistory(patientId, userId) {
    const query = `
      SELECT
  a.appointment_id,
  mr.record_id,
  a.patient_id,
  a.appointment_date AS date,
  a.appointment_type AS visit_type,
  COALESCE(mr.diagnosis, '-') AS diagnosis,
  COALESCE(mr.treatment, '-') AS treatment,
  COALESCE(a.appointment_type, 'General') AS form_type,
  CONCAT(
    d.f_name,
    ' ',
    COALESCE(d.m_name || ' ', ''),
    d.l_name
  ) AS doctor,
  c.clinic_name AS clinic,
  COALESCE(mr.total_amount, 0) AS total_amount,
  a.status
FROM appointments a
INNER JOIN patients p
  ON p.patient_id = a.patient_id
INNER JOIN doctors d
  ON d.doctor_id = a.doctor_id
INNER JOIN clinics c
  ON c.clinic_id = a.clinic_id
LEFT JOIN medical_records mr
  ON mr.appointment_id = a.appointment_id
 AND mr.patient_id = a.patient_id
WHERE a.patient_id = $1
ORDER BY a.appointment_date DESC, a.appointment_id DESC
    `;

    const { rows } = await db.query(query, [patientId]);
    return rows.map((row) => ({
      appointmentId: row.appointment_id,
      recordId: row.record_id,
      patientId: row.patient_id,
      date: row.date,
      visitType: row.visit_type,
      diagnosis: row.diagnosis,
      treatment: row.treatment,
      formType: row.form_type,
      doctor: row.doctor,
      clinic: row.clinic,
      totalAmount: Number(row.total_amount),
      status: row.status,
    }));
  }

  // medical record
  async updateMedicalRecord(recordId, data) {
    const totalAmount =
      Number(data.consultation_fee || 0) +
      Number(data.medicine_fee || 0) +
      Number(data.lab_fee || 0) +
      Number(data.other_fee || 0);

    const res = await db.query(
      `
    UPDATE medical_records
    SET
      record_date = $1,
      diagnosis = $2,
      treatment = $3,
      medications = $4,
      assessment = $5,
      is_contagious = $6,
      contagious_description = $7,
      consultation_fee = $8,
      medicine_fee = $9,
      lab_fee = $10,
      other_fee = $11,
      total_amount = $12,
      doctor_id = $13,
      clinic_id = $14,
      form_type = $15,
      pre_employment_data = $16
    WHERE record_id = $17
    RETURNING *
    `,
      [
        data.record_date,
        data.diagnosis,
        data.treatment,
        data.medications,
        data.assessment,
        data.is_contagious,
        data.contagious_description,
        data.consultation_fee,
        data.medicine_fee,
        data.lab_fee,
        data.other_fee,
        totalAmount,
        data.doctor_id,
        data.clinic_id,
        data.form_type,
        data.pre_employment_data,
        recordId,
      ],
    );

    return res.rows[0] || null;
  }

  async deleteMedicalRecord(recordId) {
    const res = await db.query(
      `
    DELETE FROM medical_records
    WHERE record_id = $1
    RETURNING record_id
    `,
      [recordId],
    );

    return res.rows[0] || null;
  }

  // prescriptions
  async getAllPrescriptionsByRecord(recordId) {
    const res = await db.query(
      `
    SELECT *
    FROM prescription
    WHERE medical_record_id = $1
    ORDER BY prescription_id DESC
    `,
      [recordId],
    );

    return res.rows;
  }

  async getPrescriptionById(prescriptionId) {
    const res = await db.query(
      `
    SELECT *
    FROM prescription
    WHERE prescription_id = $1
    LIMIT 1
    `,
      [prescriptionId],
    );

    return res.rows[0] || null;
  }

  async createPrescription(data) {
    const res = await db.query(
      `
    INSERT INTO prescription
    (
      patient_id,
      medical_record_id,
      medication_name,
      dosage,
      frequency,
      duration,
      prescription_img_path
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
      [
        data.patientId,
        data.medicalRecordId,
        data.medicationName,
        data.dosage,
        data.frequency,
        data.duration,
        data.prescriptionImgPath,
      ],
    );

    return res.rows[0];
  }

  async updatePrescription(prescriptionId, data) {
    const res = await db.query(
      `
    UPDATE prescription
    SET
      patient_id = $1,
      medication_name = $2,
      dosage = $3,
      frequency = $4,
      duration = $5,
      prescription_img_path = $6
    WHERE prescription_id = $7
    RETURNING *
    `,
      [
        data.patientId,
        data.medicationName,
        data.dosage,
        data.frequency,
        data.duration,
        data.prescriptionImgPath,
        prescriptionId,
      ],
    );

    return res.rows[0] || null;
  }

  async deletePrescription(prescriptionId) {
    const res = await db.query(
      `
    DELETE FROM prescription
    WHERE prescription_id = $1
    RETURNING prescription_id
    `,
      [prescriptionId],
    );

    return res.rows[0] || null;
  }

  // lab results
  async getAllLabResultsByRecord(recordId) {
    const res = await db.query(
      `
    SELECT *
    FROM lab_result
    WHERE medical_record_id = $1
    ORDER BY result_id DESC
    `,
      [recordId],
    );

    return res.rows;
  }

  async getLabResultById(resultId) {
    const res = await db.query(
      `
    SELECT *
    FROM lab_result
    WHERE result_id = $1
    LIMIT 1
    `,
      [resultId],
    );

    return res.rows[0] || null;
  }

  async createLabResult(data) {
    const res = await db.query(
      `
    INSERT INTO lab_result
    (
      patient_id,
      medical_record_id,
      test_type,
      result,
      interpretation,
      lab_img_path
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
    `,
      [
        data.patientId,
        data.medicalRecordId,
        data.testType,
        data.result,
        data.interpretation,
        data.labImgPath,
      ],
    );

    return res.rows[0];
  }

  async updateLabResult(resultId, data) {
    const res = await db.query(
      `
    UPDATE lab_result
    SET
      patient_id = $1,
      test_type = $2,
      result = $3,
      interpretation = $4,
      lab_img_path = $5
    WHERE result_id = $6
    RETURNING *
    `,
      [
        data.patientId,
        data.testType,
        data.result,
        data.interpretation,
        data.labImgPath,
        resultId,
      ],
    );

    return res.rows[0] || null;
  }

  async deleteLabResult(resultId) {
    const res = await db.query(
      `
    DELETE FROM lab_result
    WHERE result_id = $1
    RETURNING result_id
    `,
      [resultId],
    );

    return res.rows[0] || null;
  }

  // certificates
  async getAllCertificatesByRecord(recordId) {
    const res = await db.query(
      `
    SELECT *
    FROM certificates
    WHERE medical_record_id = $1
    ORDER BY certificates_id DESC
    `,
      [recordId],
    );

    return res.rows;
  }

  async getCertificateById(certificateId) {
    const res = await db.query(
      `
    SELECT *
    FROM certificates
    WHERE certificates_id = $1
    LIMIT 1
    `,
      [certificateId],
    );

    return res.rows[0] || null;
  }

  async createCertificate(data) {
    const res = await db.query(
      `
    INSERT INTO certificates
    (
      patient_id,
      medical_record_id,
      certificate_type,
      remarks,
      certificates_img_path
    )
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    `,
      [
        data.patientId,
        data.medicalRecordId,
        data.certificateType,
        data.remarks,
        data.certificateImgPath,
      ],
    );

    return res.rows[0];
  }

  async updateCertificate(certificateId, data) {
    const res = await db.query(
      `
    UPDATE certificates
    SET
      patient_id = $1,
      certificate_type = $2,
      remarks = $3,
      certificates_img_path = $4
    WHERE certificates_id = $5
    RETURNING *
    `,
      [
        data.patientId,
        data.certificateType,
        data.remarks,
        data.certificateImgPath,
        certificateId,
      ],
    );

    return res.rows[0] || null;
  }

  async deleteCertificate(certificateId) {
    const res = await db.query(
      `
    DELETE FROM certificates
    WHERE certificates_id = $1
    RETURNING certificates_id
    `,
      [certificateId],
    );

    return res.rows[0] || null;
  }

  async getMedicalRecordByAppointmentId(appointmentId) {
    const res = await db.query(
      `
    SELECT
      mr.record_id,
      mr.appointment_id,
      mr.patient_id,
      mr.record_date,
      mr.diagnosis,
      mr.treatment,
      mr.medications,
      mr.assessment,
      mr.is_contagious,
      mr.contagious_description,
      mr.consultation_fee,
      mr.medicine_fee,
      mr.lab_fee,
      mr.other_fee,
      mr.total_amount,
      mr.doctor_id,
      mr.clinic_id,
      mr.form_type,
      mr.pre_employment_data,
      mr.created_at
    FROM medical_records mr
    WHERE mr.appointment_id = $1
    LIMIT 1
    `,
      [appointmentId],
    );

    return res.rows[0] || null;
  }
}
