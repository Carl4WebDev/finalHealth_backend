import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class AppointmentRescheduled extends DomainEvent {
  constructor({ appointmentId, actorId }) {
    super("AppointmentRescheduled", {
      appointmentId,
      actorId,
    });
  }
}
