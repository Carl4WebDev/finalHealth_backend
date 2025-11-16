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
}
