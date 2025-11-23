export default class IDoctorSessionRepository {
  save(session) {
    throw new Error("save() not implemented");
  }
  update(session) {
    throw new Error("update() not implemented");
  }
  delete(id) {
    throw new Error("delete() not implemented");
  }
  findByDoctor(doctorId) {
    throw new Error("findByDoctor() not implemented");
  }
  findConflicts(doctorId, clinicId, dayOfWeek, startTime, endTime) {
    throw new Error("findConflicts() not implemented");
  }
}
