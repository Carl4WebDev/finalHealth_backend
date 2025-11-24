import VitalSigns from "../../domain/entities/VitalSigns.js";

export default class VitalSignsService {
  constructor(vitalRepo) {
    this.vitalRepo = vitalRepo;
  }

  async createVital(dto) {
    const vital = new VitalSigns.Builder()
      .setAppointmentId(dto.appointmentId)
      .setPatientId(dto.patientId)
      .setBloodPressure(dto.bloodPressure)
      .setHeartRate(dto.heartRate)
      .setTemperature(dto.temperature)
      .setOxygenSaturation(dto.oxygenSaturation)
      .setWeight(dto.weight)
      .setVitalImgPath(dto.vitalImgPath)
      .build();

    return await this.vitalRepo.save(vital);
  }

  async updateVital(dto) {
    const existing = await this.vitalRepo.findById(dto.vitalId);
    if (!existing) throw new Error("Vital signs record not found");

    const updated = existing
      .toBuilder()
      .setBloodPressure(dto.bloodPressure ?? existing.bloodPressure)
      .setHeartRate(dto.heartRate ?? existing.heartRate)
      .setTemperature(dto.temperature ?? existing.temperature)
      .setOxygenSaturation(dto.oxygenSaturation ?? existing.oxygenSaturation)
      .setWeight(dto.weight ?? existing.weight)
      .setVitalImgPath(
        dto.vitalImgPath !== undefined
          ? dto.vitalImgPath
          : existing.vitalImgPath
      )
      .build();

    return await this.vitalRepo.update(dto.vitalId, updated);
  }

  async getById(id) {
    return await this.vitalRepo.findById(id);
  }

  async listByAppointment(appointmentId) {
    return await this.vitalRepo.findByAppointment(appointmentId);
  }

  async listByPatient(patientId) {
    return await this.vitalRepo.findByPatient(patientId);
  }
}
