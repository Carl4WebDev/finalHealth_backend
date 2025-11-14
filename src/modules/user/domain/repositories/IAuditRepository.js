export default class IAuditRepository {
  logAuth(userId, action, details) {
    throw new Error("logAuth must be implemented");
  }
}
