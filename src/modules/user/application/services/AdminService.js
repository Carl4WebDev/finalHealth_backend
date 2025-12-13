import bcrypt from "bcrypt";
import Admin from "../../domain/entities/Admin.js";
import AppError from "../../../../core/errors/AppError.js";
import ValidationError from "../../../../core/errors/ValidationError.js";

export default class AdminService {
  constructor(adminRepo, auditRepo, authTokenService) {
    this.adminRepo = adminRepo;
    this.auditRepo = auditRepo;
    this.authTokenService = authTokenService;
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
        "ADMIN_EMAIL_EXISTS"
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

    if (this.auditRepo?.logAuth) {
      await this.auditRepo.logAuth(
        createdAdmin.adminId,
        "ADMIN",
        "REGISTER",
        `Admin registered: ${createdAdmin.email}`
      );
    }

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
    if (!admin) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    if (!admin.isActive()) {
      throw new AppError("Admin account is inactive", 403, "ADMIN_INACTIVE");
    }

    const tokenPayload = {
      adminId: admin.adminId,
      email: admin.email,
      role: "ADMIN",
    };

    const token = this.authTokenService.generateToken(tokenPayload);

    await this.auditRepo.logAuth(
      admin.adminId,
      "ADMIN",
      "LOGIN_SUCCESS",
      "Admin logged in"
    );

    return { token, admin };
  }
}
