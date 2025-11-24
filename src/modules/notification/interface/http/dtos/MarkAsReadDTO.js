export default class MarkAsReadDTO {
  constructor(params) {
    this.notificationId = Number(params.id);
  }
}
