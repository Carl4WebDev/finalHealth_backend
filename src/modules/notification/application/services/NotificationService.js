import Notification from "../../domain/entities/Notification.js";

export default class NotificationService {
  constructor(repo) {
    this.repo = repo;
  }

  async create(dto) {
    const notif = new Notification.Builder()
      .setSenderAdminId(dto.senderAdminId)
      .setReceipientUserId(dto.receipientUserId)
      .setTitle(dto.title)
      .setMessage(dto.message)
      .build();

    return await this.repo.save(notif);
  }

  async markAsRead(dto) {
    return await this.repo.markAsRead(dto.notificationId);
  }

  async listByUser(userId) {
    return await this.repo.listByUser(userId);
  }
}
