// src/domain/repositories/IAdminRepository.js

export default class IAdminRepository {
  async findByEmail(email) {
    throw new Error("findByEmail() not implemented");
  }

  async createAdmin(admin) {
    throw new Error("createAdmin() not implemented");
  }

  async updateAdminStatus(adminId, status) {
    throw new Error("updateAdminStatus() not implemented");
  }
}
