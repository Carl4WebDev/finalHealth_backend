/**
 * UserService Unit Tests
 *
 * WHAT IS BEING TESTED:
 * - Business logic inside UserService
 * - Expected success paths
 * - Expected failure paths
 *
 * WHAT IS NOT BEING TESTED:
 * - Database
 * - bcrypt internals
 * - JWT internals
 * - Express / controllers
 *
 * All external dependencies are mocked.
 */

import UserService from "../UserService.js";
import AppError from "../../../../../core/errors/AppError.js";
import ValidationError from "../../../../../core/errors/ValidationError.js";
import bcrypt from "bcrypt";

import { jest } from "@jest/globals";

// ------------------------------------------------------------
// MOCKS
// ------------------------------------------------------------
jest.mock("bcrypt");

describe("UserService", () => {
  let userRepo;
  let auditRepo;
  let authTokenService;
  let service;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
      createUserProfile: jest.fn(),
      findByUserId: jest.fn(),
      updatePassword: jest.fn(),
      updateProfileImage: jest.fn(),
    };

    auditRepo = {
      logAuth: jest.fn(),
      logAction: jest.fn(),
    };

    authTokenService = {
      generateToken: jest.fn(),
    };

    service = new UserService(userRepo, auditRepo, authTokenService);

    jest.clearAllMocks();
  });

  // ============================================================
  // REGISTER USER
  // ============================================================
  describe("register()", () => {
    it("registers a user successfully", async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed-password");

      userRepo.createUser.mockResolvedValue({
        userId: 1,
        email: "test@test.com",
      });

      userRepo.createUserProfile.mockResolvedValue();

      const dto = {
        email: "test@test.com",
        password: "123456",
        fName: "John",
        lName: "Doe",
        contactNum: "09123456789", // ✅ REQUIRED by domain
        address: "Davao City",
        birthDate: "2000-01-01",
      };

      const result = await service.register(dto);

      expect(result.email).toBe("test@test.com");
      expect(userRepo.findByEmail).toHaveBeenCalledWith("test@test.com");
      expect(userRepo.createUser).toHaveBeenCalled();
      expect(userRepo.createUserProfile).toHaveBeenCalled();
      expect(auditRepo.logAuth).toHaveBeenCalled();
    });

    it("throws ValidationError when email or password is missing", async () => {
      await expect(service.register({ email: "x@test.com" })).rejects.toThrow(
        ValidationError
      );
    });

    it("throws AppError when email already exists", async () => {
      userRepo.findByEmail.mockResolvedValue({ email: "test@test.com" });

      await expect(
        service.register({
          email: "test@test.com",
          password: "123456",
          contactNum: "09123456789",
        })
      ).rejects.toThrow(AppError);
    });
  });

  // ============================================================
  // LOGIN USER
  // ============================================================
  describe("login()", () => {
    it("logs in successfully with valid credentials", async () => {
      const user = {
        userId: 1,
        email: "test@test.com",
        password: "hashed",
        isActive: () => true,
      };

      userRepo.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      authTokenService.generateToken.mockReturnValue("fake-jwt-token");

      const result = await service.login({
        email: "test@test.com",
        password: "123456",
      });

      expect(result.token).toBe("fake-jwt-token");
      expect(result.user.email).toBe("test@test.com"); // ✅ behavior-based
      expect(auditRepo.logAuth).toHaveBeenCalledWith(
        1,
        "USER",
        "LOGIN_SUCCESS",
        "User logged in"
      );
    });

    it("throws ValidationError when email or password is missing", async () => {
      await expect(service.login({ email: "x@test.com" })).rejects.toThrow(
        ValidationError
      );
    });

    it("throws AppError when email is not found", async () => {
      userRepo.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: "x@test.com", password: "123456" })
      ).rejects.toThrow(AppError);
    });

    it("throws AppError when password is incorrect", async () => {
      userRepo.findByEmail.mockResolvedValue({
        userId: 1,
        password: "hashed",
        isActive: () => true,
      });

      bcrypt.compare.mockResolvedValue(false);

      await expect(
        service.login({ email: "x@test.com", password: "wrong" })
      ).rejects.toThrow(AppError);
    });

    it("throws AppError when account is inactive", async () => {
      userRepo.findByEmail.mockResolvedValue({
        userId: 1,
        password: "hashed",
        isActive: () => false,
      });

      bcrypt.compare.mockResolvedValue(true);

      await expect(
        service.login({ email: "x@test.com", password: "123456" })
      ).rejects.toThrow(AppError);
    });
  });

  // ============================================================
  // GET USER PERSONAL INFO
  // ============================================================
  describe("getUserPersonalInfo()", () => {
    it("returns user and profile entities when found", async () => {
      userRepo.findByUserId.mockResolvedValue({
        user: {
          userId: 1,
          email: "test@test.com",
          password: "hashed",
          status: "Active",
          createdAt: new Date(),
        },
        userProfile: {
          profileId: 1,
          userId: 1,
          fName: "John",
          lName: "Doe",
          contactNum: "09123456789",
        },
      });

      const result = await service.getUserPersonalInfo(1);

      expect(result.user).toBeDefined();
      expect(result.profile).toBeDefined();
    });

    it("throws AppError when user or profile is missing", async () => {
      userRepo.findByUserId.mockResolvedValue(null);

      await expect(service.getUserPersonalInfo(1)).rejects.toThrow(AppError);
    });
  });

  // ============================================================
  // UPDATE SETTINGS
  // ============================================================
  describe("updateSettings()", () => {
    it("throws ValidationError when only one password field is provided", async () => {
      userRepo.findByUserId.mockResolvedValue({
        user: { password: "hashed" },
        userProfile: {},
      });

      await expect(
        service.updateSettings(1, { currentPassword: "old" })
      ).rejects.toThrow(ValidationError);
    });

    it("throws AppError when current password is incorrect", async () => {
      userRepo.findByUserId.mockResolvedValue({
        user: { password: "hashed" },
        userProfile: {},
      });

      bcrypt.compare.mockResolvedValue(false);

      await expect(
        service.updateSettings(1, {
          currentPassword: "wrong",
          newPassword: "newpass",
        })
      ).rejects.toThrow(AppError);
    });

    it("updates password successfully", async () => {
      userRepo.findByUserId.mockResolvedValue({
        user: { password: "hashed" },
        userProfile: {},
      });

      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue("new-hash");

      const result = await service.updateSettings(1, {
        currentPassword: "old",
        newPassword: "newpass",
      });

      expect(userRepo.updatePassword).toHaveBeenCalled();
      expect(auditRepo.logAuth).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });
});
