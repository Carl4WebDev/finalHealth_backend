import bcrypt from "bcrypt";
import User from "../../domain/entities/User.js";
import UserProfile from "../../domain/entities/UserProfile.js";

export default class UserService {
  constructor(userRepo, auditRepo, authTokenService) {
    this.userRepo = userRepo;
    this.auditRepo = auditRepo;
    this.authTokenService = authTokenService;
  }

  // dto: RegisterUserDTO
  async register(dto) {
    const { email, password } = dto;

    const exists = await this.userRepo.findByEmail(email);
    if (exists) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const userEntity = new User.Builder()
      .setEmail(email)
      .setPassword(hashedPassword)
      .setStatus("Active")
      .build();

    const createdUser = await this.userRepo.createUser(userEntity);

    const profileEntity = new UserProfile.Builder()
      .setUserId(createdUser.userId)
      .setFName(dto.fName)
      .setMName(dto.mName)
      .setLName(dto.lName)
      .setContactNum(dto.contactNum)
      .setAddress(dto.address)
      .setBirthDate(dto.birthDate)
      .build();

    await this.userRepo.createUserProfile(profileEntity);

    // You can log registration if you want
    if (this.auditRepo?.logAuth) {
      await this.auditRepo.logAuth(
        createdUser.userId,
        "USER",
        "REGISTER",
        `User registered with email ${createdUser.email}`
      );
    }

    // Return the domain entity; controller will map it to DTO
    return createdUser;
  }

  // dto: LoginUserDTO
  async login(dto) {
    const { email, password } = dto;

    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      await this.auditRepo.logAuth(
        null,
        "USER",
        "FAILED_LOGIN",
        `Email not found: ${email}`
      );
      throw new Error("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      await this.auditRepo.logAuth(
        user.userId,
        "USER",
        "FAILED_LOGIN",
        "Wrong password"
      );
      throw new Error("Invalid credentials");
    }

    if (!user.isActive()) {
      await this.auditRepo.logAuth(
        user.userId,
        "USER",
        "FAILED_LOGIN",
        "Inactive account"
      );
      throw new Error("Account is inactive");
    }

    const tokenPayload = {
      userId: user.userId,
      email: user.email,
      role: "USER",
    };

    const token = this.authTokenService.generateToken(tokenPayload);

    await this.auditRepo.logAuth(
      user.userId,
      "USER",
      "LOGIN_SUCCESS",
      "User logged in"
    );

    return { token, user };
  }
}
