import DomainEvent from "../../../../../core/events/DomainEvent.js";

export default class ClinicApproved extends DomainEvent {
  constructor({ clinicId, adminId }) {
    super("ClinicApproved", {
      clinicId,
      adminId,
    });
  }
}
