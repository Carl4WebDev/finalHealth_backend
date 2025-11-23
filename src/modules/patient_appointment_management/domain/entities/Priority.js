export default class Priority {
  constructor(builder) {
    this.priorityId = builder.priorityId;
    this.priorityName = builder.priorityName; // Emergency, PWD, Follow-up, Normal
    this.description = builder.description;
    this.priorityRank = builder.priorityRank; // 1 = highest
  }

  static get Builder() {
    return class {
      setPriorityId(v) {
        this.priorityId = v;
        return this;
      }
      setPriorityName(v) {
        this.priorityName = v;
        return this;
      }
      setDescription(v) {
        this.description = v;
        return this;
      }
      setPriorityRank(v) {
        this.priorityRank = v;
        return this;
      }

      build() {
        if (!this.priorityName) throw new Error("priorityName required");
        if (this.priorityRank == null) throw new Error("priorityRank required");
        return new Priority(this);
      }
    };
  }
}
