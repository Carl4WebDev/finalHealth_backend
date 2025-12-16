import bcrypt from "bcrypt";
import User from "../../domain/entities/User.js";
import UserProfile from "../../domain/entities/UserProfile.js";

import AppError from "../../../../core/errors/AppError.js";
import ValidationError from "../../../../core/errors/ValidationError.js";

import UserRegistered from "../../domain/events/user/UserRegistered.js";
import UserLoggedIn from "../../domain/events/user/UserLoggedIn.js";
import UserLoginFailed from "../../domain/events/user/UserLoginFailed.js";
import UserPasswordChanged from "../../domain/events/user/UserPasswordChanged.js";
import UserProfileImageUpdated from "../../domain/events/user/UserProfileImageUpdated.js";

export default class UserService {
  constructor(userRepo, authTokenService, eventBus) {
    this.userRepo = userRepo;
    this.authTokenService = authTokenService;
    this.eventBus = eventBus;
  }

  // ============================================================
  // REGISTER USER
  // ============================================================
  async register(dto) {
    const { email, password } = dto;

    if (!email || !password) {
      throw new ValidationError("Email and password are required", {
        missingFields: ["email", "password"],
      });
    }

    const exists = await this.userRepo.findByEmail(email);
    if (exists) {
      throw new AppError("Email already exists", 409, "EMAIL_EXISTS");
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

    // ✅ EMIT EVENT
    await this.eventBus.publish(
      new UserRegistered({
        userId: createdUser.userId,
        email: createdUser.email,
      })
    );

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
      await this.eventBus.publish(
        new UserLoginFailed({
          email,
          reason: "EMAIL_NOT_FOUND",
        })
      );
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      await this.eventBus.publish(
        new UserLoginFailed({
          email,
          reason: "WRONG_PASSWORD",
        })
      );
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    if (!user.isActive()) {
      await this.eventBus.publish(
        new UserLoginFailed({
          email,
          reason: "ACCOUNT_INACTIVE",
        })
      );
      throw new AppError("Account is inactive", 403, "ACCOUNT_INACTIVE");
    }

    const token = this.authTokenService.generateToken({
      userId: user.userId,
      email: user.email,
      role: "USER",
    });

    // ✅ EMIT EVENT
    await this.eventBus.publish(new UserLoggedIn({ userId: user.userId }));

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

    // PASSWORD CHANGE
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        throw new ValidationError("Both current and new password are required");
      }

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        throw new AppError("Current password is incorrect", 400);
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await this.userRepo.updatePassword(userId, newHash);

      // ✅ EMIT EVENT
      await this.eventBus.publish(new UserPasswordChanged({ userId }));
    }

    // PROFILE IMAGE UPDATE
    if (profileImgPath) {
      const updatedProfile = userProfile
        .toBuilder()
        .setProfileImg(profileImgPath)
        .build();

      await this.userRepo.updateProfileImage(updatedProfile);

      // ✅ EMIT EVENT
      await this.eventBus.publish(
        new UserProfileImageUpdated({
          userId,
          imagePath: profileImgPath,
        })
      );
    }

    return { success: true, userId };
  }
}
