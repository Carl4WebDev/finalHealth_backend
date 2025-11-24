import Prescription from "../../domain/entities/Prescription.js";

export default class PrescriptionService {
  constructor(prescriptionRepo) {
    this.prescriptionRepo = prescriptionRepo;
  }

  async createPrescription(dto) {
    const prescription = new Prescription.Builder()
      .setAppointmentId(dto.appointmentId)
      .setPatientId(dto.patientId)
      .setPrescribedDate(dto.prescribedDate)
      .setMedicationName(dto.medicationName)
      .setDosage(dto.dosage)
      .setFrequency(dto.frequency)
      .setDuration(dto.duration)
      .setInstructions(dto.instructions)
      .setPrescriptionImgPath(dto.prescriptionImgPath)
      .build();

    return await this.prescriptionRepo.save(prescription);
  }

  async updatePrescription(dto) {
    const existing = await this.prescriptionRepo.findById(dto.prescriptionId);
    if (!existing) throw new Error("Prescription not found");

    const updated = existing
      .toBuilder()
      .setPrescribedDate(dto.prescribedDate ?? existing.prescribedDate)
      .setMedicationName(dto.medicationName ?? existing.medicationName)
      .setDosage(dto.dosage ?? existing.dosage)
      .setFrequency(dto.frequency ?? existing.frequency)
      .setDuration(dto.duration ?? existing.duration)
      .setInstructions(dto.instructions ?? existing.instructions)
      .setPrescriptionImgPath(
        dto.prescriptionImgPath !== undefined
          ? dto.prescriptionImgPath
          : existing.prescriptionImgPath
      )
      .build();

    return await this.prescriptionRepo.update(dto.prescriptionId, updated);
  }

  async getById(id) {
    return await this.prescriptionRepo.findById(id);
  }

  async listByAppointment(appointmentId) {
    return await this.prescriptionRepo.findByAppointment(appointmentId);
  }

  async listByPatient(patientId) {
    return await this.prescriptionRepo.findByPatient(patientId);
  }
}
