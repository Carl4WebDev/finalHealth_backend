export default class UpdateLabResultDTO {
  constructor(body, params) {
    this.resultId = Number(params.id);
    this.testDate = body.testDate;
    this.testType = body.testType;
    this.result = body.result || null;
    this.interpretation = body.interpretation || null;
    this.labImgPath = body.labImgPath || null;
  }
}
