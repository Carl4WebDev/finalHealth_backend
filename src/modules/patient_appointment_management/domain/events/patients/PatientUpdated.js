import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class PatientUpdated extends DomainEvent {
  constructor({ patientId, actorId }) {
    super("PatientUpdated", {
      patientId,
      actorId,
    });
  }
}
