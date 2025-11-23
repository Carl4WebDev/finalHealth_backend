export default class IAppointmentRepository {
  async save(appointment) {
    throw new Error("Not implemented");
  }
  async findById(id) {
    throw new Error("Not implemented");
  }
  async findByDateRange(clinicId, fromDate, toDate) {
    throw new Error("Not implemented");
  }
  async findByPatient(patientId) {
    throw new Error("Not implemented");
  }
  async update(appointment) {
    throw new Error("Not implemented");
  }
  async updateStatus(id, status) {
    throw new Error("Not implemented");
  }
  async checkDoubleBooking(patientId, date) {
    throw new Error("Not implemented");
  }
}
