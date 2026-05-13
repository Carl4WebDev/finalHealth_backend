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

async getPatientAnalytics(userId) {
  // 1. Gender Distribution (Using user_patients for the 9 patients)
  const genderQuery = `
    SELECT p.gender, COUNT(DISTINCT p.patient_id) as count 
    FROM patients p
    INNER JOIN user_patients up ON up.patient_id = p.patient_id
    WHERE up.user_id = $1 
    GROUP BY p.gender`;

  // 2. Visit Types (Ensuring 9 patients stay visible)
  const visitTypeQuery = `
    SELECT 
      COUNT(DISTINCT CASE WHEN v_count <= 1 THEN patient_id END) as new_p,
      COUNT(DISTINCT CASE WHEN v_count > 1 THEN patient_id END) as ret_p
    FROM (
      SELECT up.patient_id, COUNT(a.appointment_id) as v_count 
      FROM user_patients up
      LEFT JOIN appointments a ON a.patient_id = up.patient_id 
        AND LOWER(a.status) != 'cancelled'
      WHERE up.user_id = $1 
      GROUP BY up.patient_id
    ) AS v_counts`;

  // 3. No-Show Rate (Counting by owner, not ID)
  const noShowQuery = `
    SELECT 
      COUNT(a.appointment_id) as total_appts, 
      COUNT(CASE WHEN LOWER(a.status) IN ('no-show', 'cancelled') THEN 1 END) as cancelled_appts
    FROM appointments a
    WHERE a.clinic_id IN (SELECT clinic_id FROM clinics WHERE user_id = $1)`;

  // 4. Busiest Day (NAME-BASED: Looks at names of clinics you own)
  const busiestDayQuery = `
    SELECT TO_CHAR(a.appointment_date, 'Day') as day_name, COUNT(*) as count
    FROM appointments a
    JOIN clinics c_current ON a.clinic_id = c_current.clinic_id
    WHERE c_current.clinic_name IN (SELECT clinic_name FROM clinics WHERE user_id = $1)
    GROUP BY day_name ORDER BY count DESC LIMIT 1`;

  // 5. Age Groups
  const ageGroupQuery = `
    SELECT 
      CASE 
        WHEN age < 18 THEN '0-17'
        WHEN age BETWEEN 18 AND 35 THEN '18-35'
        WHEN age BETWEEN 36 AND 60 THEN '36-60'
        ELSE '60+'
      END as range, 
      COUNT(*) as count
    FROM (
      SELECT EXTRACT(YEAR FROM AGE(p.date_of_birth))::int as age 
      FROM patients p
      INNER JOIN user_patients up ON up.patient_id = p.patient_id
      WHERE up.user_id = $1 AND p.date_of_birth IS NOT NULL
    ) AS ages 
    GROUP BY range 
    ORDER BY range`;

  // 6. New Patients This Month
  const monthlyQuery = `
    SELECT COUNT(DISTINCT up.patient_id)::int as count 
    FROM user_patients up
    JOIN patients p ON p.patient_id = up.patient_id
    WHERE up.user_id = $1 
    AND p.created_at >= DATE_TRUNC('month', CURRENT_DATE)`;

  // 7. Clinic Revenue (THE 40K NAME-FIX)
  const clinicRevenueQuery = `
    SELECT 
      c.clinic_name, 
      (
        SELECT COALESCE(SUM(mr.total_amount), 0)
        FROM medical_records mr
        JOIN clinics c_historical ON mr.clinic_id = c_historical.clinic_id
        WHERE c_historical.clinic_name = c.clinic_name
      )::float as revenue
    FROM clinics c
    WHERE c.user_id = $1
    GROUP BY c.clinic_id, c.clinic_name
    ORDER BY revenue DESC`;

  const [genders, visits, noShow, busy, ages, monthly, revenue] = await Promise.all([
    db.query(genderQuery, [userId]),
    db.query(visitTypeQuery, [userId]),
    db.query(noShowQuery, [userId]),
    db.query(busiestDayQuery, [userId]),
    db.query(ageGroupQuery, [userId]),
    db.query(monthlyQuery, [userId]),
    db.query(clinicRevenueQuery, [userId]) 
  ]);

  return {
    gender_dist: {
      male: Number(genders.rows.find(r => r.gender === 'Male')?.count || 0),
      female: Number(genders.rows.find(r => r.gender === 'Female')?.count || 0),
      other: Number(genders.rows.find(r => r.gender === 'Other')?.count || 0)
    },
    visit_types: {
      new: Number(visits.rows[0]?.new_p || 0),
      returning: Number(visits.rows[0]?.ret_p || 0)
    },
    noShowRate: Number(noShow.rows[0]?.total_appts) > 0 
      ? Math.round((Number(noShow.rows[0]?.cancelled_appts) / Number(noShow.rows[0]?.total_appts)) * 100) 
      : 0,
    busiestDay: busy.rows[0]?.day_name?.trim() || "None",
    ageDist: ages.rows.map(row => ({ name: String(row.range), value: Number(row.count) })),
    clinic_revenue: revenue.rows.map(row => ({ name: row.clinic_name, value: Number(row.revenue) })),
    total_patients: Number(visits.rows[0]?.new_p || 0) + Number(visits.rows[0]?.ret_p || 0),
    new_this_month: Number(monthly.rows[0]?.count || 0)
  };
}
}