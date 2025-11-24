import Notification from "../../domain/entities/Notification.js";

export default class NotificationService {
  constructor(repo, auditService) {
    this.repo = repo;
    this.auditService = auditService; // NEW
  }

  async create(dto, actor) {
    const notif = new Notification.Builder()
      .setSenderAdminId(dto.senderAdminId)
      .setReceipientUserId(dto.receipientUserId)
      .setTitle(dto.title)
      .setMessage(dto.message)
      .build();

    const saved = await this.repo.save(notif);

    // AUDIT LOG — Notification sent
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "NOTIFICATION_SENT",
      tableAffected: "notification",
      recordId: saved.notificationId,
      details: JSON.stringify(dto),
    });

    return saved;
  }

  async markAsRead(dto, actor) {
    const saved = await this.repo.markAsRead(dto.notificationId);

    // AUDIT LOG — Notification read
    await this.auditService.record({
      actorId: actor.id,
      actorType: actor.role,
      action: "NOTIFICATION_READ",
      tableAffected: "notification",
      recordId: dto.notificationId,
      details: `Notification ${dto.notificationId} marked as read`,
    });

    return saved;
  }

  async listByUser(userId) {
    return await this.repo.listByUser(userId);
  }
}
