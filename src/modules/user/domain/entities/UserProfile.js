export default class UserProfile {
  constructor(builder) {
    this.profileId = builder.profileId;
    this.userId = builder.userId;
    this.fName = builder.fName;
    this.mName = builder.mName;
    this.lName = builder.lName;
    this.contactNum = builder.contactNum;
    this.address = builder.address;
    this.birthDate = builder.birthDate;
    this.profileImgPath = builder.profileImgPath || null;
  }

  toBuilder() {
    return new UserProfile.Builder()
      .setProfileId(this.profileId)
      .setUserId(this.userId)
      .setFName(this.fName)
      .setMName(this.mName)
      .setLName(this.lName)
      .setContactNum(this.contactNum)
      .setAddress(this.address)
      .setBirthDate(this.birthDate)
      .setProfileImg(this.profileImgPath);
  }

  static get Builder() {
    return class {
      setProfileId(id) {
        this.profileId = id;
        return this;
      }

      setUserId(userId) {
        this.userId = userId;
        return this;
      }

      setFName(val) {
        this.fName = val;
        return this;
      }

      setMName(val) {
        this.mName = val;
        return this;
      }

      setLName(val) {
        this.lName = val;
        return this;
      }

      setContactNum(num) {
        this.contactNum = num;
        return this;
      }

      setAddress(address) {
        this.address = address;
        return this;
      }

      setBirthDate(date) {
        this.birthDate = date;
        return this;
      }

      setProfileImg(path) {
        this.profileImgPath = path;
        return this;
      }

      build() {
        if (!this.userId) throw new Error("userId required");
        if (!this.contactNum) throw new Error("contactNum required");
        return new UserProfile(this);
      }
    };
  }
}
