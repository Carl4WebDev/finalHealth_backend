export default class PatientType {
  constructor(builder) {
    this.patientTypeId = builder.patientTypeId;
    this.typeName = builder.typeName; // Normal, Senior, PWD, etc.
    this.priorityRank = builder.priorityRank;
  }

  static get Builder() {
    return class {
      setPatientTypeId(v) {
        this.patientTypeId = v;
        return this;
      }
      setTypeName(v) {
        this.typeName = v;
        return this;
      }
      setPriorityRank(v) {
        this.priorityRank = v;
        return this;
      }

      build() {
        if (!this.typeName) throw new Error("typeName required");
        if (this.priorityRank == null) throw new Error("priorityRank required");
        return new PatientType(this);
      }
    };
  }
}
