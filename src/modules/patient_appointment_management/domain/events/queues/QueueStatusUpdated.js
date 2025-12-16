import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class QueueStatusUpdated extends DomainEvent {
  constructor({ queueEntryId, status, actorId }) {
    super("QueueStatusUpdated", {
      queueEntryId,
      status,
      actorId,
    });
  }
}
