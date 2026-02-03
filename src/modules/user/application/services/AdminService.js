import bcrypt from "bcrypt";
import Admin from "../../domain/entities/Admin.js";
import AppError from "../../../../core/errors/AppError.js";
import ValidationError from "../../../../core/errors/ValidationError.js";

import AdminLoggedIn from "../../domain/events/admin/AdminLoggedIn.js";
import AdminLoginFailed from "../../domain/events/admin/AdminLoginFailed.js";
import AdminRegistered from "../../domain/events/admin/AdminRegistered.js";

export default class AdminService {
  constructor(adminRepo, authTokenService, eventBus) {
    this.adminRepo = adminRepo;
    this.authTokenService = authTokenService;
    this.eventBus = eventBus;
  }

  // ============================================================
  // REGISTER ADMIN
  // ============================================================
  async register(dto) {
    const { fName, lName, email, password } = dto;

    if (!fName || !lName || !email || !password) {
      throw new ValidationError("All fields are required", {
        missingFields: ["fName", "lName", "email", "password"],
      });
    }

    const exists = await this.adminRepo.findByEmail(email);
    if (exists) {
      throw new AppError(
        "Admin email already exists",
        409,
        "ADMIN_EMAIL_EXISTS",
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminEntity = new Admin.Builder()
      .setFName(fName)
      .setLName(lName)
      .setEmail(email)
      .setPassword(hashedPassword)
      .setStatus("Active")
      .build();

    const createdAdmin = await this.adminRepo.createAdmin(adminEntity);

    await this.eventBus.publish(
      new AdminRegistered({
        adminId: createdAdmin.adminId,
        email: createdAdmin.email,
      }),
    );

    return createdAdmin;
  }

  // ============================================================
  // LOGIN ADMIN
  // ============================================================
  async login(dto) {
    const { email, password } = dto;

    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const admin = await this.adminRepo.findByEmail(email);

    // ❌ admin not found
    if (!admin) {
      await this.eventBus.publish(
        new AdminLoginFailed({
          email,
          reason: "EMAIL_NOT_FOUND",
        }),
      );
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const valid = await bcrypt.compare(password, admin.password);

    // ❌ wrong password
    if (!valid) {
      await this.eventBus.publish(
        new AdminLoginFailed({
          email,
          reason: "WRONG_PASSWORD",
        }),
      );
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    // ❌ inactive account
    if (!admin.isActive()) {
      await this.eventBus.publish(
        new AdminLoginFailed({
          email,
          reason: "ADMIN_INACTIVE",
        }),
      );
      throw new AppError("Admin account is inactive", 403, "ADMIN_INACTIVE");
    }

    const tokenPayload = {
      adminId: admin.adminId,
      email: admin.email,
      role: "ADMIN",
    };

    const token = this.authTokenService.generateToken(tokenPayload);

    // ✅ SUCCESS EVENT
    await this.eventBus.publish(
      new AdminLoggedIn({
        adminId: admin.adminId,
      }),
    );

    return { token, admin };
  }

  async getAllSubscribers() {
    const records = await this.adminRepo.fetchUsersWithSubscriptions();

    return records;
  }
}
