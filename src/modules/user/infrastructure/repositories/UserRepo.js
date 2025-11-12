import db from "../../../../core/database/db.js";

export default class UserRepo {
  async findByEmail(email) {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  async save(user) {
    const result = await db.query(
      "INSERT INTO users (email, password, status) VALUES ($1, $2, $3) RETURNING *",
      [user.email, user.password, user.status]
    );
    return result.rows[0];
  }
}
