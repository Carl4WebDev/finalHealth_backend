import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class DoctorSessionUpdated extends DomainEvent {
  constructor({ sessionId, actorId }) {
    super("DoctorSessionUpdated", {
      sessionId,
      actorId,
    });
  }
}
