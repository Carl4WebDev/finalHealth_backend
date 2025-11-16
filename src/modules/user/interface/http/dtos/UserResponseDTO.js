export default class UserResponseDTO {
  constructor(user) {
    this.userId = user.userId;
    this.email = user.email;
    this.status = user.status;
    this.createdAt = user.createdAt;
  }
}
