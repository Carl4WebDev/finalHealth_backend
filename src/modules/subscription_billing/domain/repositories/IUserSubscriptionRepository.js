export default class IUserSubscriptionRepository {
  async save(entity) {
    throw new Error("save() not implemented");
  }

  async update(id, entity) {
    throw new Error("update() not implemented");
  }

  async findById(id) {
    throw new Error("findById() not implemented");
  }

  async findActiveByUser(userId) {
    throw new Error("findActiveByUser() not implemented");
  }
}
