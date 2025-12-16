import eventBus from "../../../../core/events/EventBus.js";
import AuditRepo from "../../infrastructure/repositories/AuditRepo.js";

const auditRepo = new AuditRepo();

eventBus.subscribe("AdminRegistered", async (event) => {
  const { adminId, email } = event.payload;

  await auditRepo.logAuth(
    adminId,
    "ADMIN",
    "REGISTER",
    `Admin registered: ${email}`
  );
});

eventBus.subscribe("AdminLoggedIn", async (event) => {
  const { adminId } = event.payload;

  await auditRepo.logAuth(adminId, "ADMIN", "LOGIN_SUCCESS", "Admin logged in");
});

eventBus.subscribe("AdminLoginFailed", async (event) => {
  const { email, reason } = event.payload;

  await auditRepo.logAuth(
    null,
    "ADMIN",
    "FAILED_LOGIN",
    `Admin login failed: ${email} (${reason})`
  );
});
