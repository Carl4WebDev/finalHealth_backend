export default class VitalSigns {
  constructor(builder) {
    this.vitalId = builder.vitalId;
    this.appointmentId = builder.appointmentId;
    this.patientId = builder.patientId;
    this.bloodPressure = builder.bloodPressure;
    this.heartRate = builder.heartRate;
    this.temperature = builder.temperature;
    this.oxygenSaturation = builder.oxygenSaturation;
    this.weight = builder.weight;
    this.vitalImgPath = builder.vitalImgPath;
    this.createdAt = builder.createdAt || new Date();
  }

  static get Builder() {
    return class {
      setVitalId(v) {
        this.vitalId = v;
        return this;
      }
      setAppointmentId(v) {
        this.appointmentId = v;
        return this;
      }
      setPatientId(v) {
        this.patientId = v;
        return this;
      }
      setBloodPressure(v) {
        this.bloodPressure = v;
        return this;
      }
      setHeartRate(v) {
        this.heartRate = v;
        return this;
      }
      setTemperature(v) {
        this.temperature = v;
        return this;
      }
      setOxygenSaturation(v) {
        this.oxygenSaturation = v;
        return this;
      }
      setWeight(v) {
        this.weight = v;
        return this;
      }
      setVitalImgPath(v) {
        this.vitalImgPath = v;
        return this;
      }
      setCreatedAt(v) {
        this.createdAt = v;
        return this;
      }

      build() {
        if (!this.appointmentId) throw new Error("appointmentId required");
        if (!this.patientId) throw new Error("patientId required");
        return new VitalSigns(this);
      }
    };
  }

  toBuilder() {
    return new VitalSigns.Builder()
      .setVitalId(this.vitalId)
      .setAppointmentId(this.appointmentId)
      .setPatientId(this.patientId)
      .setBloodPressure(this.bloodPressure)
      .setHeartRate(this.heartRate)
      .setTemperature(this.temperature)
      .setOxygenSaturation(this.oxygenSaturation)
      .setWeight(this.weight)
      .setVitalImgPath(this.vitalImgPath)
      .setCreatedAt(this.createdAt);
  }
}
