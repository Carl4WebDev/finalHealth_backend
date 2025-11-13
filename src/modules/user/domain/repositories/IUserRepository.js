export default class IUserRepo {
  createUser(user) {
    throw new Error("createUser() must be implemented");
  }

  createUserProfile(profile) {
    throw new Error("createUserProfile() must be implemented");
  }

  findByEmail(email) {
    throw new Error("findByEmail() must be implemented");
  }
}
