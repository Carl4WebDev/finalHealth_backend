import bcrypt from "bcrypt";
import User from "../../domain/entities/User.js";
import UserProfile from "../../domain/entities/UserProfile.js";

export default class UserService {
  constructor(userRepo, auditRepo, authTokenService) {
    this.userRepo = userRepo;
    this.auditRepo = auditRepo;
    this.authTokenService = authTokenService;
  }

  async register(data) {
    const { email, password } = data;

    const exists = await this.userRepo.findByEmail(email);
    if (exists) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    // Build user entity
    const user = new User.Builder()
      .setEmail(email)
      .setPassword(hashedPassword)
      .setStatus("Active")
      .build();

    const userId = await this.userRepo.createUser(user);

    // Build profile entity
    const profile = new UserProfile.Builder()
      .setUserId(userId)
      .setFName(data.f_name)
      .setMName(data.m_name)
      .setLName(data.l_name)
      .setContactNum(data.contact_num)
      .setAddress(data.address)
      .setBirthDate(data.birth_date)
      .build();

    await this.userRepo.createUserProfile(profile);

    return { userId, email };
  }

  async login(email, password) {
    const user = await this.userRepo.findByEmail(email);

    // User not found
    if (!user) {
      await this.auditRepo.logAuth(
        null,
        "USER", // actorType
        "FAILED_LOGIN", // action
        `Email not found: ${email}` // details
      );
      throw new Error("Invalid credentials");
    }

    // Wrong password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      await this.auditRepo.logAuth(
        user.user_id,
        "USER",
        "FAILED_LOGIN",
        "Wrong password"
      );
      throw new Error("Invalid credentials");
    }

    // Success – issue token
    const token = this.authTokenService.generateToken(user);

    await this.auditRepo.logAuth(
      user.user_id,
      "USER",
      "LOGIN_SUCCESS",
      "User logged in"
    );

    return { token, user };
  }
}
