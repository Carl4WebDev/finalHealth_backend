export default class UpdateReferralRecordDTO {
  constructor(body, params) {
    this.referralId = Number(params.id);
    this.referredTo = body.referredTo || null;
    this.reason = body.reason || null;
    this.notes = body.notes || null;
    this.referralImgPath = body.referralImgPath || null;
  }
}
