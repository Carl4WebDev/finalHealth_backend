import db from "./src/core/database/db.js";

(async () => {
  try {
    const result = await db.query("SELECT NOW()");
    console.log("✅ Connected to PostgreSQL:", result.rows[0].now);
    process.exit(0);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
})();
