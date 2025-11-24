export default class UpdateVitalSignsDTO {
  constructor(body, params) {
    this.vitalId = Number(params.id);
    this.bloodPressure = body.bloodPressure || null;
    this.heartRate = body.heartRate || null;
    this.temperature = body.temperature || null;
    this.oxygenSaturation = body.oxygenSaturation || null;
    this.weight = body.weight || null;
    this.vitalImgPath = body.vitalImgPath || null;
  }
}
