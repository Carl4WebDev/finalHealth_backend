import db from "../../../../core/database/db.js";
import IUserRepository from "../../domain/repositories/IUserRepository.js";
import User from "../../domain/entities/User.js";
import UserProfile from "../../domain/entities/UserProfile.js";
const BASE_API = process.env.API_BASE_URL;
export default class UserRepo extends IUserRepository {
  async findByEmail(email) {
    const query = `
    SELECT 
      u.user_id,
      u.email,
      u.password,
      u.status,
      u.created_at,

      up.profile_id,
      up.f_name,
      up.m_name,
      up.l_name,
      up.contact_num,
      up.address,
      up.birth_date,
      up.profile_img_path
    FROM users u
    LEFT JOIN user_profile up ON u.user_id = up.user_id
    WHERE u.email = $1
    LIMIT 1
  `;

    const { rows } = await db.query(query, [email]);
    if (!rows.length) return null;

    const row = rows[0];

    // Build core user entity (NO CHANGE)
    const user = this._toUserEntity(row);

    // Attach lightweight profile data directly — NOT as a new entity
    user.firstName = row.f_name || null;
    user.middleName = row.m_name || null;
    user.lastName = row.l_name || null;
    user.contactNumber = row.contact_num || null;
    user.address = row.address || null;
    user.birthDate = row.birth_date || null;

    // Build image URL safely
    user.profileImgPath = row.profile_img_path || null;

    return user; // RETURN SAME TYPE AS BEFORE
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
    { fName, mName, lName, contactNum, address, birthDate },
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
    SELECT 
      u.user_id,       
      u.email,      
      u.password,      
      u.status,        
      u.created_at,    

      up.profile_id   AS profile_id,
      up.user_id      AS profile_user_id,
      up.f_name,
      up.m_name,
      up.l_name,
      up.contact_num,
      up.address,
      up.birth_date,
      up.profile_img_path
    FROM users u
    JOIN user_profile up ON u.user_id = up.user_id
    WHERE u.user_id = $1
    LIMIT 1;
  `;

    const { rows } = await db.query(query, [userId]);
    if (!rows.length) return null;

    const row = rows[0];

    return {
      user: this._toUserEntity(row),
      userProfile: this._toProfileEntity(row),
    };
  }

  async updatePassword(userId, hashedPassword) {
    await db.query(`UPDATE users SET password=$1 WHERE user_id=$2`, [
      hashedPassword,
      userId,
    ]);
  }
  async updateProfileImage(userId, filePath) {
    const query = `
    UPDATE user_profile
    SET profile_img_path = $1
    WHERE user_id = $2
  `;

    await db.query(query, [filePath, userId]);
  }

  _toUserEntity(row) {
    return new User.Builder()
      .setUserId(row.user_id)
      .setEmail(row.email)
      .setPassword(row.password)
      .setStatus(row.status)
      .setCreatedAt(row.created_at)
      .build();
  }

  _toProfileEntity(row) {
    const profile = new UserProfile.Builder()
      .setProfileId(row.profile_id)
      .setUserId(row.profile_user_id)
      .setFName(row.f_name)
      .setMName(row.m_name)
      .setLName(row.l_name)
      .setContactNum(row.contact_num)
      .setAddress(row.address)
      .setBirthDate(row.birth_date)
      .setProfileImg(row.profile_img_path)
      .build();

    const builtUrl = this._buildImageUrl(row.profile_img_path);

    // SAFE OVERRIDE so every part of the system sees the FULL URL
    profile.profileImgUrl = builtUrl;
    profile.profileImgPath = builtUrl; // ≤ THIS makes it consistent everywhere

    return profile;
  }

  _buildImageUrl(filename) {
    if (!filename) return null;
    const base = BASE_API || "http://localhost:5000";
    return `${base}/uploads/profile/${filename}`;
  }
}
