import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class AppointmentCompleted extends DomainEvent {
  constructor({ appointmentId, actorId }) {
    super("AppointmentCompleted", {
      appointmentId,
      actorId,
    });
  }
}
