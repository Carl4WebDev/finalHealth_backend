import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class AdminLoggedIn extends DomainEvent {
  constructor({ adminId }) {
    super("AdminLoggedIn", { adminId });
  }
}
