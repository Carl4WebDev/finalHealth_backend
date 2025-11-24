import INotificationRepository from "../domain/repositories/INotificationRepository.js";
import Notification from "../domain/entities/Notification.js";
import db from "../../../core/database/db.js";

export default class NotificationRepo extends INotificationRepository {
  async save(n) {
    const query = `
      INSERT INTO notifications 
      (sender_admin_id, receipient_user_id, title, message)
      VALUES ($1,$2,$3,$4)
      RETURNING *;
    `;

    const values = [n.senderAdminId, n.receipientUserId, n.title, n.message];

    const res = await db.query(query, values);
    return this._toEntity(res.rows[0]);
  }

  async markAsRead(id) {
    const res = await db.query(
      `
      UPDATE notifications 
      SET is_read = TRUE
      WHERE notification_id = $1
      RETURNING *;
      `,
      [id]
    );

    return this._toEntity(res.rows[0]);
  }

  async listByUser(userId) {
    const res = await db.query(
      `
      SELECT * FROM notifications
      WHERE receipient_user_id = $1
      ORDER BY sent_at DESC;
      `,
      [userId]
    );

    return res.rows.map((r) => this._toEntity(r));
  }

  async findById(id) {
    const res = await db.query(
      `SELECT * FROM notifications WHERE notification_id = $1`,
      [id]
    );
    if (!res.rows.length) return null;
    return this._toEntity(res.rows[0]);
  }

  _toEntity(row) {
    return new Notification.Builder()
      .setNotificationId(row.notification_id)
      .setSenderAdminId(row.sender_admin_id)
      .setReceipientUserId(row.receipient_user_id)
      .setTitle(row.title)
      .setMessage(row.message)
      .setIsRead(row.is_read)
      .setSentAt(row.sent_at)
      .build();
  }
}
