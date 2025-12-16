import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class UserProfileImageUpdated extends DomainEvent {
  constructor({ userId, imagePath }) {
    super("UserProfileImageUpdated", {
      userId,
      imagePath,
    });
  }
}
