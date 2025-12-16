import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class AppointmentCreated extends DomainEvent {
  constructor({ appointmentId, actorId, actorRole }) {
    super("AppointmentCreated", {
      appointmentId,
      actorId,
      actorRole,
    });
  }
}
