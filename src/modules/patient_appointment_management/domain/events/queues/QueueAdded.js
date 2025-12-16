import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class QueueAdded extends DomainEvent {
  constructor({ queueEntryId, actorId, actorRole }) {
    super("QueueAdded", {
      queueEntryId,
      actorId,
      actorRole,
    });
  }
}
