import db from "../../../../core/database/db.js";
import IAdminRepository from "../../domain/repositories/IAdminRepository.js";
import Admin from "../../domain/entities/Admin.js";

export default class AdminRepo extends IAdminRepository {
  async findByEmail(email) {
    const query = `
      SELECT admin_id, f_name, l_name, email, password, 
             CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END AS status,
             created_at
      FROM admins
      WHERE email = $1
      LIMIT 1
    `;

    const { rows } = await db.query(query, [email]);
    if (rows.length === 0) return null;

    const row = rows[0];

    return new Admin.Builder()
      .setAdminId(row.admin_id)
      .setFName(row.f_name)
      .setLName(row.l_name)
      .setEmail(row.email)
      .setPassword(row.password)
      .setStatus(row.status)
      .setCreatedAt(row.created_at)
      .build();
  }

  async createAdmin(admin) {
    const query = `
      INSERT INTO admins (f_name, l_name, email, password, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING admin_id, created_at
    `;

    const { rows } = await db.query(query, [
      admin.fName,
      admin.lName,
      admin.email,
      admin.password,
      admin.isActive(),
    ]);

    return new Admin.Builder()
      .setAdminId(rows[0].admin_id)
      .setFName(admin.fName)
      .setLName(admin.lName)
      .setEmail(admin.email)
      .setPassword(admin.password)
      .setStatus(admin.status)
      .setCreatedAt(rows[0].created_at)
      .build();
  }

  async updateAdminStatus(adminId, status) {
    const isActive = status === "Active";

    await db.query(`UPDATE admins SET is_active = $1 WHERE admin_id = $2`, [
      isActive,
      adminId,
    ]);
  }

  async fetchUsersWithSubscriptions() {
    const query = `
    SELECT
      u.user_id,
      u.email,
      u.status,
      up.f_name,
      up.m_name,
      up.l_name,
      up.contact_num, 
      up.address,
      us.subscription_id,
      us.status AS subscription_status,
      us.start_date,
      us.end_date,
      sp.plan_name, -- This will be shown as "Subscription Type" in the UI
      sp.price,
      (SELECT MAX(payment_date) 
       FROM subscription_payment 
       WHERE subscription_id = us.subscription_id) as last_payment_date
    FROM users u
    LEFT JOIN (
      SELECT DISTINCT ON (user_id)
        user_id,
        subscription_id,
        status,
        start_date,
        end_date,
        plan_id
      FROM user_subscription
      WHERE status <> 'cancelled'
      ORDER BY user_id, start_date DESC
    ) us ON us.user_id = u.user_id
    LEFT JOIN subscription_plan sp
      ON sp.plan_id = us.plan_id
    LEFT JOIN user_profile up
      ON up.user_id = u.user_id
  `;

    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Database Error in fetchUsersWithSubscriptions:", error);
      throw error;
    }
  }

  async getCustomerRevenue() {
    const query = `
        SELECT 
            up.user_id,
            up.f_name, 
            up.l_name, 
            up.profile_img_path,
            spn.plan_name,
            pay.amount,
            pay.payment_method,
            pay.transaction_id,
            pay.payment_date,
            pay.status as payment_status
        FROM public.user_profile up
        JOIN public.user_subscription us ON up.user_id = us.user_id
        JOIN public.subscription_plan spn ON us.plan_id = spn.plan_id
        JOIN public.subscription_payment pay ON us.subscription_id = pay.subscription_id
        ORDER BY pay.payment_date DESC;
    `;

    try {
        // Use the imported 'db' instance directly
        const { rows } = await db.query(query); 
        return rows;
    } catch (error) {
        console.error("Database Error in AdminRepo (getCustomerRevenue):", error);
        throw error;
    }
  }

async getDashboardSummary() {
  // 1. Fetching all the counts for the Overview and Today's Summary cards
  const statsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM public.users) as total_users,
      (SELECT COUNT(*) FROM public.doctors WHERE is_verified = true) as verified_doctors,
      (SELECT COUNT(*) FROM public.user_subscription WHERE status = 'active') as active_subscribers,
      (SELECT COUNT(*) FROM public.users WHERE created_at >= NOW() - INTERVAL '30 days') as new_signups,
      (SELECT COUNT(*) FROM public.users WHERE created_at >= CURRENT_DATE) as today_new_users,
      (SELECT COUNT(*) FROM public.appointments WHERE appointment_date = CURRENT_DATE) as today_appointments,
      (SELECT COALESCE(SUM(amount), 0) FROM public.subscription_payment WHERE status = 'completed' AND payment_date >= CURRENT_DATE) as today_revenue
  `;

  /* 2. The "Activity Feed" Query
     This combines data from 3 different tables into one list, sorted by time.
  */
  const activityQuery = `
  SELECT description, sort_date FROM (
    -- New User Registrations
    (SELECT concat('New user registered: ', email) as description, created_at as sort_date 
     FROM public.users)
    UNION ALL
    -- New Appointments (Ensure this pulls by created_at, regardless of queue status)
    (SELECT concat('New appointment booked for Dr. ', l_name) as description, a.created_at as sort_date 
     FROM public.appointments a
     JOIN public.doctors d ON a.doctor_id = d.doctor_id)
    UNION ALL
    -- Completed Payments
    (SELECT concat('Payment Received: P', amount) as description, payment_date as sort_date 
     FROM public.subscription_payment WHERE status = 'completed')
  ) AS combined_activity
  ORDER BY sort_date DESC 
  LIMIT 5
`;

  try {
    const statsResult = await db.query(statsQuery);
    const activityResult = await db.query(activityQuery);
    
    const data = statsResult.rows[0];

    return {
      total_users: parseInt(data.total_users),
      verified_doctors: parseInt(data.verified_doctors),
      active_subscribers: parseInt(data.active_subscribers),
      new_signups: parseInt(data.new_signups),
      today: {
        new_users: parseInt(data.today_new_users),
        appointments: parseInt(data.today_appointments),
        revenue: parseFloat(data.today_revenue)
      },
      // This now contains a mix of users, appointments, and payments
      recent_activities: activityResult.rows
    };
  } catch (error) {
    console.error("Database Error in getDashboardSummary:", error);
    throw error;
  }
}
}
