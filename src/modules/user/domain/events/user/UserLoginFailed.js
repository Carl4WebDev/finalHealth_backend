import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class UserLoginFailed extends DomainEvent {
  constructor({ email, reason }) {
    super("UserLoginFailed", { email, reason });
  }
}
