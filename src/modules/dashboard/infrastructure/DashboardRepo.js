import db from "../../../core/database/db.js";

export default class DashboardRepo {
  async getSummaryCards(userId) {
    const clinicsQuery = `
      SELECT COUNT(DISTINCT c.clinic_id)::int AS total
      FROM clinics c 
      WHERE c.user_id = $1
    `;

    const doctorsQuery = `
      SELECT COUNT(DISTINCT d.doctor_id)::int AS total
      FROM doctors d
      WHERE d.user_id = $1
    `;

    const appointmentsQuery = `
      SELECT COUNT(*)::int AS total
      FROM appointments a
      INNER JOIN user_patients up
        ON up.patient_id = a.patient_id
      WHERE up.user_id = $1
    `;

    const [clinicsRes, doctorsRes, appointmentsRes] = await Promise.all([
      db.query(clinicsQuery, [userId]),
      db.query(doctorsQuery, [userId]),
      db.query(appointmentsQuery, [userId]),
    ]);

    return {
      clinics: clinicsRes.rows[0]?.total || 0,
      doctors: doctorsRes.rows[0]?.total || 0,
      appointments: appointmentsRes.rows[0]?.total || 0,
    };
  }

  async getUpcomingAppointments(userId) {
    const query = `
    SELECT
      a.appointment_id,
      a.appointment_date,
      a.appointment_type,
      a.status,
      CONCAT(p.f_name, ' ', p.l_name) AS patient_name,
      CONCAT(d.f_name, ' ', d.l_name) AS doctor_name,
      c.clinic_name
    FROM appointments a
    INNER JOIN user_patients up
      ON up.patient_id = a.patient_id
    INNER JOIN patients p
      ON p.patient_id = a.patient_id
    INNER JOIN doctors d
      ON d.doctor_id = a.doctor_id
    INNER JOIN clinics c
      ON c.clinic_id = a.clinic_id
    WHERE up.user_id = $1
      AND a.appointment_date >= CURRENT_DATE
      AND a.status = 'Scheduled'
    ORDER BY a.appointment_date ASC, a.appointment_id ASC
    LIMIT 4
  `;

    const { rows } = await db.query(query, [userId]);
    return rows;
  }

  async getSubscriptionOverview(userId) {
    const query = `
      SELECT
        us.subscription_id,
        us.start_date,
        us.end_date,
        us.status,
        us.renewal_date,
        sp.plan_id,
        sp.plan_name,
        sp.plan_type,
        sp.price,
        sp.max_number_users,
        sp.max_doctors,
        sp.max_clinics,
        sp.max_medical_records_per_patient
      FROM user_subscription us
      INNER JOIN subscription_plan sp
        ON sp.plan_id = us.plan_id
      WHERE us.user_id = $1
        AND us.status = 'active'
      ORDER BY us.created_at DESC
      LIMIT 1
    `;

    const { rows } = await db.query(query, [userId]);
    return rows[0] || null;
  }

  async getClinicNetwork(userId) {
    const query = `
    SELECT
      c.clinic_id,
      c.clinic_name,
      c.is_verified,
      COUNT(DISTINCT dc.doctor_id)::int AS doctors_count,
      COUNT(DISTINCT a.patient_id)::int AS patients_count
    FROM clinics c
    LEFT JOIN doctor_clinics dc
      ON dc.clinic_id = c.clinic_id
    LEFT JOIN appointments a
      ON a.clinic_id = c.clinic_id
    WHERE c.user_id = $1
    GROUP BY c.clinic_id, c.clinic_name, c.is_verified
    ORDER BY c.clinic_name ASC
  `;

    const { rows } = await db.query(query, [userId]);
    return rows;
  }
  async getDoctorNetwork(userId) {
    const query = `
    SELECT
      d.doctor_id,
      CONCAT(d.f_name, ' ', d.l_name) AS doctor_name,
      d.specialization,
      d.license_number,
      COUNT(DISTINCT dc.clinic_id)::int AS clinics_count,
      COUNT(DISTINCT a.patient_id)::int AS patients_count
    FROM doctors d
    LEFT JOIN doctor_clinics dc
      ON dc.doctor_id = d.doctor_id
    LEFT JOIN appointments a
      ON a.doctor_id = d.doctor_id
    WHERE d.user_id = $1
    GROUP BY
      d.doctor_id,
      d.f_name,
      d.l_name,
      d.specialization,
      d.license_number
    ORDER BY doctor_name ASC
  `;

    const { rows } = await db.query(query, [userId]);
    return rows;
  }

  async getActiveSubscription(userId) {
    const query = `
    SELECT
      us.subscription_id,
      us.user_id,
      us.start_date,
      us.end_date,
      us.status,
      us.renewal_date,
      sp.plan_id,
      sp.plan_name,
      sp.plan_type,
      sp.price,
      sp.max_number_users,
      sp.max_doctors,
      sp.max_clinics,
      sp.max_medical_records_per_patient
    FROM user_subscription us
    INNER JOIN subscription_plan sp
      ON sp.plan_id = us.plan_id
    WHERE us.user_id = $1
      AND us.status = 'active'
    ORDER BY us.created_at DESC
    LIMIT 1
  `;

    const { rows } = await db.query(query, [userId]);
    return rows[0] || null;
  }

  async countPatientsOfUser(userId) {
    const query = `
      SELECT COUNT(DISTINCT up.patient_id)::int AS total
      FROM user_patients up
      WHERE up.user_id = $1
    `;

    const { rows } = await db.query(query, [userId]);
    return rows[0]?.total || 0;
  }

  async countActiveUsersForSubscription(userId) {
    const query = `
      SELECT COUNT(*)::int AS total
      FROM users u
      WHERE u.status = 'Active'
        AND EXISTS (
          SELECT 1
          FROM user_subscription us
          WHERE us.user_id = u.user_id
            AND us.user_id = $1
            AND us.status = 'active'
        )
    `;

    const { rows } = await db.query(query, [userId]);
    return rows[0]?.total || 0;
  }
}