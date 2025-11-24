export default class ILabResultRepository {
  async save(labResult) {
    throw new Error("save() not implemented");
  }

  async update(labResult) {
    throw new Error("update() not implemented");
  }

  async findById(id) {
    throw new Error("findById() not implemented");
  }

  async findByAppointment(appointmentId) {
    throw new Error("findByAppointment() not implemented");
  }

  async findByPatient(patientId) {
    throw new Error("findByPatient() not implemented");
  }
}
