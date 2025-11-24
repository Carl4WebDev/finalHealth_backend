export default class CreateFollowupNoteDTO {
  constructor(body) {
    this.appointmentId = Number(body.appointmentId);
    this.patientId = Number(body.patientId);
    this.followupDate = body.followupDate; // "YYYY-MM-DD"
    this.notes = body.notes || null;
    this.followupImgPath = body.followupImgPath || null;
  }
}
