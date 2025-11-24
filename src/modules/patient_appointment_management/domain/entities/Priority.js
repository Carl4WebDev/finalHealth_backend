export default class Priority {
  constructor(builder) {
    this.priorityId = builder.priorityId;
    this.priorityLevel = builder.priorityLevel;
    this.description = builder.description;
    this.priorityRank = builder.priorityRank;
  }

  static get Builder() {
    return class {
      setPriorityId(v) {
        this.priorityId = v;
        return this;
      }
      setPriorityLevel(v) {
        this.priorityLevel = v;
        return this;
      } // FIXED
      setDescription(v) {
        this.description = v;
        return this;
      }
      setPriorityRank(v) {
        this.priorityRank = v;
        return this;
      }

      build() {
        if (!this.priorityLevel) throw new Error("priorityLevel required");
        if (this.priorityRank == null) throw new Error("priorityRank required");

        return new Priority(this);
      }
    };
  }
}
