export default class UserProfile {
  constructor(builder) {
    this.profileId = builder.profileId;
    this.userId = builder.userId;
    this.f_name = builder.f_name;
    this.m_name = builder.m_name;
    this.l_name = builder.l_name;
    this.contact_num = builder.contact_num;
    this.address = builder.address;
    this.birth_date = builder.birth_date;
    this.profile_img_path = builder.profile_img_path || null;
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
        this.f_name = val;
        return this;
      }
      setMName(val) {
        this.m_name = val;
        return this;
      }
      setLName(val) {
        this.l_name = val;
        return this;
      }
      setContactNum(num) {
        this.contact_num = num;
        return this;
      }
      setAddress(address) {
        this.address = address;
        return this;
      }
      setBirthDate(date) {
        this.birth_date = date;
        return this;
      }
      setProfileImg(path) {
        this.profile_img_path = path;
        return this;
      }

      build() {
        if (!this.userId) throw new Error("userId required");
        if (!this.contact_num) throw new Error("contact_num required");
        return new UserProfile(this);
      }
    };
  }
}
