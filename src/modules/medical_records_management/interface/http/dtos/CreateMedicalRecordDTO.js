export default class CreateMedicalRecordDTO {
  constructor(body) {
    this.appointmentId = Number(body.appointmentId);
    this.patientId = Number(body.patientId);
    this.recordDate = body.recordDate; // "YYYY-MM-DD"

    this.diagnosis = body.diagnosis || null;
    this.treatment = body.treatment || null;
    this.medications = body.medications || null;
    this.assessment = body.assessment || null;

    this.isContagious =
      body.isContagious === undefined ? false : Boolean(body.isContagious);
    this.contagiousDescription = body.contagiousDescription || null;

    this.consultationFee =
      body.consultationFee !== undefined ? Number(body.consultationFee) : 0;
    this.medicineFee =
      body.medicineFee !== undefined ? Number(body.medicineFee) : 0;
    this.labFee = body.labFee !== undefined ? Number(body.labFee) : 0;
    this.otherFee = body.otherFee !== undefined ? Number(body.otherFee) : 0;

    // optional override; if not provided, service will compute
    this.totalAmount =
      body.totalAmount !== undefined ? Number(body.totalAmount) : null;
  }
}
