import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class UserPasswordChanged extends DomainEvent {
  constructor({ userId }) {
    super("UserPasswordChanged", {
      userId,
    });
  }
}
