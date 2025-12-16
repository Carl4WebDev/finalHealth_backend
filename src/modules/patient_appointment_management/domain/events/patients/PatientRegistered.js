import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class PatientRegistered extends DomainEvent {
  constructor({ patientId, actorId, actorRole }) {
    super("PatientRegistered", {
      patientId,
      actorId,
      actorRole,
    });
  }
}
