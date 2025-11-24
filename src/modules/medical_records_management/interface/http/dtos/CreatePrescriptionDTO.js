export default class CreatePrescriptionDTO {
  constructor(body) {
    this.appointmentId = Number(body.appointmentId);
    this.patientId = Number(body.patientId);
    this.prescribedDate = body.prescribedDate;
    this.medicationName = body.medicationName;
    this.dosage = body.dosage || null;
    this.frequency = body.frequency || null;
    this.duration = body.duration || null;
    this.instructions = body.instructions || null;
    this.prescriptionImgPath = body.prescriptionImgPath || null;
  }
}
