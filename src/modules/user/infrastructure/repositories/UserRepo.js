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

  // Update the user profile with new details
  async updateProfile(
    userId,
    { fName, mName, lName, contactNum, address, birthDate }
  ) {
    const query = `
      UPDATE user_profile
      SET f_name = $1, m_name = $2, l_name = $3, contact_num = $4, address = $5, birth_date = $6
      WHERE user_id = $7
      RETURNING *;
    `;
    const { rows } = await db.query(query, [
      fName,
      mName,
      lName,
      contactNum,
      address,
      birthDate,
      userId,
    ]);
    return rows[0]; // Return the updated profile
  }

  async findByUserId(userId) {
    const query = `
      SELECT u.user_id, u.email, u.password, u.status, u.created_at,
             up.f_name, up.m_name, up.l_name, up.contact_num, up.address, up.birth_date, up.profile_img_path
      FROM users u
      JOIN user_profile up ON u.user_id = up.user_id
      WHERE u.user_id = $1
      LIMIT 1
    `;

    const { rows } = await db.query(query, [userId]);

    if (rows.length === 0) return null;

    const row = rows[0];

    // Build and return the full User and UserProfile data
    const user = new User.Builder()
      .setUserId(row.user_id)
      .setEmail(row.email)
      .setPassword(row.password)
      .setStatus(row.status)
      .setCreatedAt(row.created_at)
      .build();

    const userProfile = new UserProfile.Builder()
      .setUserId(row.user_id)
      .setFName(row.f_name)
      .setMName(row.m_name)
      .setLName(row.l_name)
      .setContactNum(row.contact_num)
      .setAddress(row.address)
      .setBirthDate(row.birth_date)
      .setProfileImg(row.profile_img_path)
      .build();

    return { user, userProfile }; // Return both user and profile data
  }
}
