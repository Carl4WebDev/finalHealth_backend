import bcrypt from "bcrypt";
import Admin from "../../domain/entities/Admin.js";

export default class AdminService {
  constructor(adminRepo, auditRepo, authTokenService) {
    this.adminRepo = adminRepo;
    this.auditRepo = auditRepo;
    this.authTokenService = authTokenService;
  }

  async register(dto) {
    const exists = await this.adminRepo.findByEmail(dto.email);
    if (exists) throw new Error("Admin email already exists");

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const adminEntity = new Admin.Builder()
      .setFName(dto.fName)
      .setLName(dto.lName)
      .setEmail(dto.email)
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

  async login(dto) {
    const admin = await this.adminRepo.findByEmail(dto.email);

    if (!admin) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(dto.password, admin.password);
    if (!valid) throw new Error("Invalid credentials");

    if (!admin.isActive()) throw new Error("Inactive admin account");

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
