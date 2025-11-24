export default class CreateVitalSignsDTO {
  constructor(body) {
    this.appointmentId = Number(body.appointmentId);
    this.patientId = Number(body.patientId);
    this.bloodPressure = body.bloodPressure || null;
    this.heartRate = body.heartRate || null;
    this.temperature = body.temperature || null;
    this.oxygenSaturation = body.oxygenSaturation || null;
    this.weight = body.weight || null;
    this.vitalImgPath = body.vitalImgPath || null;
  }
}
