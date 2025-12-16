import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class ClinicApproved extends DomainEvent {
  constructor({ clinicId, actorId }) {
    super("ClinicApproved", {
      clinicId,
      actorId,
    });
  }
}
