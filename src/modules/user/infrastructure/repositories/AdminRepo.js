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

      us.subscription_id,
      us.status AS subscription_status,
      us.start_date,
      us.end_date,
      us.auto_renew,

      sp.plan_id,
      sp.plan_name,
      sp.plan_type,
      sp.price
    FROM users u
    LEFT JOIN (
      SELECT DISTINCT ON (user_id)
        user_id,
        subscription_id,
        status,
        start_date,
        end_date,
        auto_renew,
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

    const { rows } = await db.query(query);
    return rows;
  }
}
