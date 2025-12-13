import bcrypt from "bcrypt";
import User from "../../domain/entities/User.js";
import UserProfile from "../../domain/entities/UserProfile.js";

import AppError from "../../../../core/errors/AppError.js";
import ValidationError from "../../../../core/errors/ValidationError.js";

export default class UserService {
  constructor(userRepo, auditRepo, authTokenService) {
    this.userRepo = userRepo;
    this.auditRepo = auditRepo;
    this.authTokenService = authTokenService;
  }

  // ============================================================
  // REGISTER USER
  // ============================================================
  async register(dto) {
    const { email, password } = dto;

    // Validate payload
    if (!email || !password) {
      throw new ValidationError("Email and password are required", {
        missingFields: ["email", "password"],
      });
    }

    // Check if email already exists
    const exists = await this.userRepo.findByEmail(email);
    if (exists) {
      throw new AppError(
        "Email already exists",
        409, // Conflict
        "EMAIL_EXISTS"
      );
    }

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

    // Audit (optional)
    if (this.auditRepo?.logAuth) {
      await this.auditRepo.logAuth(
        createdUser.userId,
        "USER",
        "REGISTER",
        `User registered with email ${createdUser.email}`
      );
    }

    return createdUser;
  }

  // ============================================================
  // LOGIN USER
  // ============================================================
  async login(dto) {
    const { email, password } = dto;

    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      await this.auditRepo.logAuth(
        null,
        "USER",
        "FAILED_LOGIN",
        `Email not found: ${email}`
      );

      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      await this.auditRepo.logAuth(
        user.userId,
        "USER",
        "FAILED_LOGIN",
        "Wrong password"
      );

      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    if (!user.isActive()) {
      await this.auditRepo.logAuth(
        user.userId,
        "USER",
        "FAILED_LOGIN",
        "Inactive account"
      );

      throw new AppError("Account is inactive", 403, "ACCOUNT_INACTIVE");
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

  // ============================================================
  // GET USER PERSONAL INFO
  // ============================================================
  async getUserPersonalInfo(userId) {
    const { user, userProfile } = await this.userRepo.findByUserId(userId);

    if (!user || !userProfile) {
      throw new AppError("User or profile not found", 404, "USER_NOT_FOUND");
    }

    const userEntity = new User.Builder()
      .setUserId(user.userId)
      .setEmail(user.email)
      .setPassword(user.password)
      .setStatus(user.status)
      .setCreatedAt(user.createdAt)
      .build();

    const profileEntity = new UserProfile.Builder()
      .setProfileId(userProfile.profileId)
      .setUserId(userProfile.userId)
      .setFName(userProfile.fName)
      .setMName(userProfile.mName)
      .setLName(userProfile.lName)
      .setContactNum(userProfile.contactNum)
      .setAddress(userProfile.address)
      .setBirthDate(userProfile.birthDate)
      .setProfileImg(userProfile.profileImgPath)
      .build();

    return { user: userEntity, profile: profileEntity };
  }

  // ============================================================
  // UPDATE ACCOUNT SETTINGS
  // ============================================================
  async updateSettings(userId, dto) {
    const { currentPassword, newPassword, profileImgPath } = dto;

    const result = await this.userRepo.findByUserId(userId);
    if (!result || !result.user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    const user = result.user;
    const userProfile = result.userProfile;

    // ------------------------------------------------------------
    // PASSWORD UPDATE
    // ------------------------------------------------------------
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        throw new ValidationError(
          "Both current and new password are required",
          { missingFields: ["currentPassword", "newPassword"] }
        );
      }

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        throw new AppError(
          "Current password is incorrect",
          400,
          "WRONG_CURRENT_PASSWORD"
        );
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await this.userRepo.updatePassword(userId, newHash);

      await this.auditRepo.logAuth(
        userId,
        "USER",
        "CHANGE_PASSWORD",
        "User changed password"
      );
    }

    // ------------------------------------------------------------
    // PROFILE IMAGE UPDATE
    // ------------------------------------------------------------
    if (profileImgPath) {
      const updatedProfile = userProfile
        .toBuilder()
        .setProfileImg(profileImgPath)
        .build();

      await this.userRepo.updateProfileImage(updatedProfile);

      await this.auditRepo.logAction({
        actorId: userId,
        actorType: "USER",
        action: "UPDATE_PROFILE_IMAGE",
        tableAffected: "user_profile",
        details: "User updated profile picture",
      });
    }

    return { success: true, userId };
  }
}
