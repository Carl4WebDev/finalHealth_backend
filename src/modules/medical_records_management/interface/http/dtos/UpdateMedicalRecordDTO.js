export default class UpdateMedicalRecordDTO {
  constructor(body, params) {
    this.recordId = Number(params.id);

    this.recordDate = body.recordDate;

    this.diagnosis = body.diagnosis;
    this.treatment = body.treatment;
    this.medications = body.medications;
    this.assessment = body.assessment;

    this.isContagious =
      body.isContagious === undefined ? undefined : Boolean(body.isContagious);
    this.contagiousDescription = body.contagiousDescription;

    this.consultationFee =
      body.consultationFee !== undefined
        ? Number(body.consultationFee)
        : undefined;
    this.medicineFee =
      body.medicineFee !== undefined ? Number(body.medicineFee) : undefined;
    this.labFee = body.labFee !== undefined ? Number(body.labFee) : undefined;
    this.otherFee =
      body.otherFee !== undefined ? Number(body.otherFee) : undefined;

    this.totalAmount =
      body.totalAmount !== undefined ? Number(body.totalAmount) : undefined;
  }
}
