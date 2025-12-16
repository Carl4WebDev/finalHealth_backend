import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class AdminRegistered extends DomainEvent {
  constructor({ adminId, email }) {
    super("AdminRegistered", { adminId, email });
  }
}
