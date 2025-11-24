export default class CreateReferralRecordDTO {
  constructor(body) {
    this.appointmentId = Number(body.appointmentId);
    this.patientId = Number(body.patientId);
    this.referredTo = body.referredTo || null;
    this.reason = body.reason || null;
    this.notes = body.notes || null;
    this.referralImgPath = body.referralImgPath || null;
  }
}
