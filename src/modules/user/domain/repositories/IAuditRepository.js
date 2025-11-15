export default class IAuditRepository {
  logAuth(actorId, actorType, action, details) {
    throw new Error("logAuth must be implemented");
  }
}
