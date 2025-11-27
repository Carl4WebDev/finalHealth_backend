export default class UserResponseDTO {
  constructor(user) {
    // CORE FIELDS (original)
    this.userId = user.userId;
    this.email = user.email;
    this.status = user.status;
    this.createdAt = user.createdAt;

    // OPTIONAL PROFILE FIELDS (safe)
    this.firstName = user.firstName || null;
    this.middleName = user.middleName || null;
    this.lastName = user.lastName || null;

    this.contactNumber = user.contactNumber || null;
    this.address = user.address || null;
    this.birthDate = user.birthDate || null;

    // PROFILE IMAGE URL (new)
    this.profileImgUrl = user.profileImgUrl || null;
  }
}
