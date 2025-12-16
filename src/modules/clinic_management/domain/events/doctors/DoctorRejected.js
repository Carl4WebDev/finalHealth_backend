import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class DoctorRejected extends DomainEvent {
  constructor({ doctorId, actorId, reason }) {
    super("DoctorRejected", {
      doctorId,
      actorId,
      reason,
    });
  }
}
