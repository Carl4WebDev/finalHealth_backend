import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class DoctorSessionDeleted extends DomainEvent {
  constructor({ sessionId, actorId }) {
    super("DoctorSessionDeleted", {
      sessionId,
      actorId,
    });
  }
}
