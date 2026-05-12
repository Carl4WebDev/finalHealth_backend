// src/jobs/queueCleanupJob.js
import cron from "node-cron";
import db from "../core/database/db.js";

export const startQueueCleanupJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await db.query(`
       DELETE FROM queue_entries
WHERE arrival_time::date < CURRENT_DATE
AND status IN ('waiting', 'in-progress');
      `);

      console.log(
        `Queue cleanup completed. Deleted ${result.rowCount} old queue entries.`,
      );
    } catch (error) {
      console.error("Queue cleanup failed:", error);
    }
  });
};
