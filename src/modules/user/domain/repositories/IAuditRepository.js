export default class IAuditRepository {
  // Old auth-specific method (still used by UserService/AdminService)
  async logAuth(actorId, actorType, action, details) {
    throw new Error("logAuth must be implemented");
  }

  // New generic method for all subsystems
  async logAction(entry /* AuditLogEntry */) {
    throw new Error("logAction must be implemented");
  }

  async findByActor(actorId) {
    throw new Error("findByActor must be implemented");
  }

  async findAll() {
    throw new Error("findAll must be implemented");
  }
}
