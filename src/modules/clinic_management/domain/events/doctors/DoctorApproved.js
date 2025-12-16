import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class DoctorApproved extends DomainEvent {
  constructor({ doctorId, actorId }) {
    super("DoctorApproved", {
      doctorId,
      actorId,
    });
  }
}
