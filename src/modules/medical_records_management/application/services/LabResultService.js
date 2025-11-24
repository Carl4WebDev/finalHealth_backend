import LabResult from "../../domain/entities/LabResult.js";

export default class LabResultService {
  constructor(labResultRepo) {
    this.labResultRepo = labResultRepo;
  }

  async createLabResult(dto) {
    const labResult = new LabResult.Builder()
      .setAppointmentId(dto.appointmentId)
      .setPatientId(dto.patientId)
      .setTestDate(dto.testDate)
      .setTestType(dto.testType)
      .setResult(dto.result)
      .setInterpretation(dto.interpretation)
      .setLabImgPath(dto.labImgPath)
      .build();

    return await this.labResultRepo.save(labResult);
  }

  async updateLabResult(dto) {
    const existing = await this.labResultRepo.findById(dto.resultId);
    if (!existing) throw new Error("Lab result not found");

    const updated = existing
      .toBuilder()
      .setTestDate(dto.testDate ?? existing.testDate)
      .setTestType(dto.testType ?? existing.testType)
      .setResult(dto.result ?? existing.result)
      .setInterpretation(dto.interpretation ?? existing.interpretation)
      .setLabImgPath(
        dto.labImgPath !== undefined ? dto.labImgPath : existing.labImgPath
      )
      .build();

    return await this.labResultRepo.update(dto.resultId, updated);
  }

  async getById(id) {
    return await this.labResultRepo.findById(id);
  }

  async listByAppointment(appointmentId) {
    return await this.labResultRepo.findByAppointment(appointmentId);
  }

  async listByPatient(patientId) {
    return await this.labResultRepo.findByPatient(patientId);
  }
}
