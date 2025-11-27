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
      "User logged in",
      user.userId
    );

    return { token, user };
  }

  async updateProfile(userId, dto) {
    const existing = await this.userRepo.findByUserId(userId);
    if (!existing) throw new Error("User profile not found");

    // Selective update (no null overwrite)
    const updatedData = {
      fName: dto.fName ?? existing.fName,
      mName: dto.mName ?? existing.mName,
      lName: dto.lName ?? existing.lName,
      contactNum: dto.contactNum ?? existing.contactNum,
      address: dto.address ?? existing.address,
      birthDate: dto.birthDate ?? existing.birthDate,
    };

    const updated = await this.userRepo.updateProfile(userId, updatedData);
    return updated;
  }

  // Method to get user and profile info by userId
  async getUserPersonalInfo(userId) {
    const { user, userProfile } = await this.userRepo.findByUserId(userId);

    if (!user || !userProfile) throw new Error("User or profile not found");

    // Build User entity
    const userEntity = new User.Builder()
      .setUserId(user.userId)
      .setEmail(user.email)
      .setPassword(user.password) // Required by builder
      .setStatus(user.status)
      .setCreatedAt(user.createdAt)
      .build();

    // Build UserProfile entity
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

  async changePassword(userId, dto) {
    const user = await this.userRepo.findByUserId(userId);
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) throw new Error("Incorrect current password");

    const hashed = await bcrypt.hash(dto.newPassword, 10);

    await this.userRepo.updatePassword(userId, hashed);

    await this.auditRepo.logAuth(
      userId,
      "USER",
      "PASSWORD_CHANGED",
      "User updated their password",
      userId
    );

    return true;
  }

  async updateProfileImage(userId, newPath) {
    const profile = await this.userRepo.findByUserId(userId);
    if (!profile) throw new Error("Profile not found");

    const updated = await this.userRepo.updateProfileImage(userId, newPath);

    await this.auditRepo.logAction({
      actorId: userId,
      actorType: "USER",
      action: "PROFILE_IMAGE_UPDATED",
      details: `User updated profile image`,
      recordId: userId,
    });

    return updated;
  }

  async updateSettings(userId, dto) {
    const { currentPassword, newPassword, profileImgPath } = dto;

    const result = await this.userRepo.findByUserId(userId);
    if (!result || !result.user) throw new Error("User not found");

    const user = result.user;
    const userProfile = result.userProfile;

    // ============================================================
    // PASSWORD UPDATE (optional + SAFE)
    // ============================================================
    if (currentPassword || newPassword) {
      // prevent undefined issues
      if (!currentPassword || !newPassword) {
        throw new Error("Both current and new password are required");
      }

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) throw new Error("Current password is incorrect");

      const newHash = await bcrypt.hash(newPassword, 10);

      // UPDATE ONLY PASSWORD — nothing else changes
      await this.userRepo.updatePassword(userId, newHash);

      await this.auditRepo.logAuth(
        userId,
        "USER",
        "CHANGE_PASSWORD",
        "User changed password"
      );
    }

    // ============================================================
    // PROFILE IMAGE UPDATE (optional + SAFE)
    // ============================================================
    if (profileImgPath) {
      const updatedProfile = userProfile
        .toBuilder()
        .setProfileImg(profileImgPath || userProfile.profileImgPath) // SAFE
        .build();

      await this.userRepo.updateProfileImage(updatedProfile);

      await this.auditRepo.logAction({
        actorId: userId,
        actorType: "USER",
        action: "UPDATE_PROFILE_IMAGE",
        details: "User updated profile picture",
        tableAffected: "user_profile",
      });
    }

    return { success: true, userId };
  }
}
