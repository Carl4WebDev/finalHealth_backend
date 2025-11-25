export default class QueueEntry {
  constructor(
    queueEntryId,
    patientId,
    doctorId,
    clinicId,
    priorityId,
    arrivalTime,
    status
  ) {
    this.queueEntryId = queueEntryId;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.clinicId = clinicId;
    this.priorityId = priorityId;
    this.arrivalTime = arrivalTime;
    this.status = status;
  }

  static Builder = class {
    constructor() {
      this.status = "Waiting"; // default
    }

    setQueueEntryId(id) {
      this.queueEntryId = id;
      return this;
    }
    setPatientId(id) {
      this.patientId = id;
      return this;
    }
    setDoctorId(id) {
      this.doctorId = id;
      return this;
    }
    setClinicId(id) {
      this.clinicId = id;
      return this;
    }
    setPriorityId(id) {
      this.priorityId = id;
      return this;
    }
    setArrivalTime(ts) {
      this.arrivalTime = ts;
      return this;
    }
    setStatus(status) {
      this.status = status;
      return this;
    }

    build() {
      return new QueueEntry(
        this.queueEntryId,
        this.patientId,
        this.doctorId,
        this.clinicId,
        this.priorityId,
        this.arrivalTime,
        this.status
      );
    }
  };
}
