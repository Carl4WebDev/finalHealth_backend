export default class UpdateFollowupNoteDTO {
  constructor(body, params) {
    this.followupId = Number(params.id);
    this.followupDate = body.followupDate;
    this.notes = body.notes || null;
    this.followupImgPath = body.followupImgPath || null;
  }
}
