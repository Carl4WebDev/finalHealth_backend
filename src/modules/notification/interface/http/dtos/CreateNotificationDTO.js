export default class CreateNotificationDTO {
  constructor(body) {
    this.senderAdminId = body.senderAdminId ? Number(body.senderAdminId) : null;
    this.receipientUserId = Number(body.receipientUserId);
    this.title = body.title || null;
    this.message = body.message;
  }
}
