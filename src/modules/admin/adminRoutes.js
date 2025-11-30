import express from "express";
import db from "../../core/database/db.js";
import authMiddleware from "../../core/middleware/Auth.js";

const router = express.Router();

// GET ALL USERS
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const query = `
      SELECT 
        u.user_id AS id,
        up.f_name || ' ' || up.l_name AS name,
        u.status
      FROM users u
      INNER JOIN user_profile up ON up.user_id = u.user_id
      WHERE u.status = 'Active'
      ORDER BY up.f_name ASC;
    `;

    const result = await db.query(query);

    res.json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.error("Failed loading users:", error);
    res.json({ success: false, error: "Failed loading users" });
  }
});

router.post("/deactivate", authMiddleware, async (req, res) => {
  const { name } = req.body; // full name "John Doe"

  try {
    const [f_name, l_name] = name.split(" ");

    const result = await db.query(
      `
      UPDATE users u
      SET status = 'Inactive'
      FROM user_profile up
      WHERE u.user_id = up.user_id
        AND up.f_name = $1
        AND up.l_name = $2
      RETURNING u.user_id, u.status;
      `,
      [f_name, l_name]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deactivated",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Deactivate Error:", error);
    res.json({ success: false, error: "Failed to deactivate user" });
  }
});

export default router;
