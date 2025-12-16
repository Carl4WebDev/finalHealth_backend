import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class DoctorSessionCreated extends DomainEvent {
  constructor({ sessionId, actorId }) {
    super("DoctorSessionCreated", {
      sessionId,
      actorId,
    });
  }
}
