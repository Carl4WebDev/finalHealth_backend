export default class Notification {
  constructor(builder) {
    this.notificationId = builder.notificationId;
    this.senderAdminId = builder.senderAdminId;
    this.receipientUserId = builder.receipientUserId;
    this.title = builder.title;
    this.message = builder.message;
    this.isRead = builder.isRead ?? false;
    this.sentAt = builder.sentAt ?? new Date();
  }

  static get Builder() {
    return class {
      setNotificationId(v) {
        this.notificationId = v;
        return this;
      }
      setSenderAdminId(v) {
        this.senderAdminId = v;
        return this;
      }
      setReceipientUserId(v) {
        this.receipientUserId = v;
        return this;
      }
      setTitle(v) {
        this.title = v;
        return this;
      }
      setMessage(v) {
        this.message = v;
        return this;
      }
      setIsRead(v) {
        this.isRead = v;
        return this;
      }
      setSentAt(v) {
        this.sentAt = v;
        return this;
      }

      build() {
        if (!this.receipientUserId) throw new Error("Recipient required");
        if (!this.message) throw new Error("Message required");
        return new Notification(this);
      }
    };
  }
}
