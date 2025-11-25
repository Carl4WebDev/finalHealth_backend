export default class AddToQueueDTO {
  constructor(body) {
    this.patientId = Number(body.patientId);
    this.doctorId = Number(body.doctorId);
    this.clinicId = Number(body.clinicId);
    this.priorityId = Number(body.priorityId);
    this.status = body.status || "Waiting";

    if (!this.patientId) throw new Error("patientId is required");
    if (!this.doctorId) throw new Error("doctorId is required");
    if (!this.clinicId) throw new Error("clinicId is required");
    if (!this.priorityId) throw new Error("priorityId is required");
  }
}
