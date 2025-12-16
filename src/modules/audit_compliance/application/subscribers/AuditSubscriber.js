import eventBus from "../../../../core/events/EventBus.js";
import AuditRepo from "../../infrastructure/repositories/AuditRepo.js";

const auditRepo = new AuditRepo();

eventBus.subscribe("UserRegistered", async (event) => {
  await auditRepo.logAuth(
    event.payload.userId,
    "USER",
    "REGISTER",
    `User registered with email ${event.payload.email}`
  );
});

eventBus.subscribe("UserLoginFailed", async (event) => {
  await auditRepo.logAuth(
    null,
    "USER",
    "FAILED_LOGIN",
    `Login failed: ${event.payload.reason}`
  );
});

eventBus.subscribe("UserLoggedIn", async (event) => {
  await auditRepo.logAuth(
    event.payload.userId,
    "USER",
    "LOGIN_SUCCESS",
    "User logged in"
  );
});

// ============================================================
// USER PASSWORD CHANGED
// ============================================================
eventBus.subscribe("UserPasswordChanged", async (event) => {
  const { userId } = event.payload;

  await auditRepo.logAuth(
    userId,
    "USER",
    "CHANGE_PASSWORD",
    "User changed password"
  );
});

// ============================================================
// USER PROFILE IMAGE UPDATED
// ============================================================
eventBus.subscribe("UserProfileImageUpdated", async (event) => {
  const { userId, imagePath } = event.payload;

  await auditRepo.logAction({
    actorId: userId,
    actorType: "USER",
    action: "UPDATE_PROFILE_IMAGE",
    tableAffected: "user_profile",
    details: `User updated profile image: ${imagePath}`,
  });
});
