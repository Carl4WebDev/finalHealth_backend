import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class ClinicRegistered extends DomainEvent {
  constructor({ clinicId, actorId, actorRole }) {
    super("ClinicRegistered", {
      clinicId,
      actorId,
      actorRole,
    });
  }
}
