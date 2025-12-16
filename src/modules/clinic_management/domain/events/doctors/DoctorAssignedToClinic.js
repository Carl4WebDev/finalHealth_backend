import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class DoctorAssignedToClinic extends DomainEvent {
  constructor({ doctorId, clinicId, actorId }) {
    super("DoctorAssignedToClinic", {
      doctorId,
      clinicId,
      actorId,
    });
  }
}
