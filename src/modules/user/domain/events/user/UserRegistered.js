import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class UserRegistered extends DomainEvent {
  constructor({ userId, email }) {
    super("UserRegistered", { userId, email });
  }
}
