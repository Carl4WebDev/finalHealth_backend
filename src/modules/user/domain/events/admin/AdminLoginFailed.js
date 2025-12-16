import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class AdminLoginFailed extends DomainEvent {
  constructor({ email, reason }) {
    super("AdminLoginFailed", { email, reason });
  }
}
