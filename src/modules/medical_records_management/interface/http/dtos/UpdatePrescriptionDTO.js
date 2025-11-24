export default class UpdatePrescriptionDTO {
  constructor(body, params) {
    this.prescriptionId = Number(params.id);
    this.prescribedDate = body.prescribedDate;
    this.medicationName = body.medicationName;
    this.dosage = body.dosage || null;
    this.frequency = body.frequency || null;
    this.duration = body.duration || null;
    this.instructions = body.instructions || null;
    this.prescriptionImgPath = body.prescriptionImgPath || null;
  }
}
