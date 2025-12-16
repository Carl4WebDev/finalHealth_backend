import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class UserLoggedIn extends DomainEvent {
  constructor({ userId }) {
    super("UserLoggedIn", { userId });
  }
}
