import db from "../../../../core/database/db.js";
import IUserRepository from "../../domain/repositories/IUserRepository.js";
import User from "../../domain/entities/User.js";
import UserProfile from "../../domain/entities/UserProfile.js";

export default class UserRepo extends IUserRepository {
  async findByEmail(email) {
    const query = `
      SELECT user_id, email, password, status, created_at
      FROM users
      WHERE email = $1
      LIMIT 1
    `;
    const { rows } = await db.query(query, [email]);
    if (rows.length === 0) return null;

    const row = rows[0];

    return new User.Builder()
      .setUserId(row.user_id)
      .setEmail(row.email)
      .setPassword(row.password)
      .setStatus(row.status)
      .setCreatedAt(row.created_at)
      .build();
  }

  async createUser(user) {
    const query = `
      INSERT INTO users (email, password, status)
      VALUES ($1, $2, $3)
      RETURNING user_id, email, password, status, created_at
    `;

    const { rows } = await db.query(query, [
      user.email,
      user.password,
      user.status,
    ]);

    const row = rows[0];

    return new User.Builder()
      .setUserId(row.user_id)
      .setEmail(row.email)
      .setPassword(row.password)
      .setStatus(row.status)
      .setCreatedAt(row.created_at)
      .build();
  }

  async createUserProfile(profile) {
    const query = `
      INSERT INTO user_profile
        (user_id, f_name, m_name, l_name, contact_num, address, birth_date, profile_img_path)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `;

    await db.query(query, [
      profile.userId,
      profile.fName,
      profile.mName,
      profile.lName,
      profile.contactNum,
      profile.address,
      profile.birthDate,
      profile.profileImgPath,
    ]);
  }
}
