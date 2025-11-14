import db from "../../../../core/database/db.js";
import IUserRepository from "../../domain/repositories/IUserRepository.js";

export default class UserRepo extends IUserRepository {
  async findByEmail(email) {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [email]
    );
    return result.rows[0] || null;
  }

  async createUser(user) {
    const result = await db.query(
      `INSERT INTO users (email, password, status)
       VALUES ($1, $2, $3)
       RETURNING user_id`,
      [user.email, user.password, user.status]
    );
    return result.rows[0].user_id;
  }

  async createUserProfile(profile) {
    await db.query(
      `INSERT INTO user_profile
        (user_id, f_name, m_name, l_name, contact_num, address, birth_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        profile.userId,
        profile.f_name,
        profile.m_name,
        profile.l_name,
        profile.contact_num,
        profile.address,
        profile.birth_date,
      ]
    );
  }
}
