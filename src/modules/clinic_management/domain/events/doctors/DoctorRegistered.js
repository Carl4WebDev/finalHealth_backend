import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class DoctorRegistered extends DomainEvent {
  constructor({ doctorId, actorId, actorRole }) {
    super("DoctorRegistered", {
      doctorId,
      actorId,
      actorRole,
    });
  }
}
