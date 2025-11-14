// 1. Mock bcrypt BEFORE importing UserService
jest.mock("bcrypt", () => ({
  compare: jest.fn(() => Promise.resolve(true)),
}));

import bcrypt from "bcrypt";
import UserService from "../application/services/UserService.js";
import { jest } from "@jest/globals";

// Mock repos/services
const mockRepo = { findByEmail: jest.fn() };
const mockAudit = { logAuth: jest.fn() };
const mockToken = { generateToken: jest.fn().mockReturnValue("fake-jwt") };

describe("UserService.login()", () => {
  let service;

  beforeEach(() => {
    service = new UserService(mockRepo, mockAudit, mockToken);
    jest.clearAllMocks();
  });

  test("login_userNotFound_throwError", async () => {
    mockRepo.findByEmail.mockResolvedValue(null);

    await expect(service.login("none@gmail.com", "123")).rejects.toThrow(
      "Invalid credentials"
    );

    expect(mockAudit.logAuth).toHaveBeenCalledWith(
      null,
      "FAILED_LOGIN",
      "User not found"
    );
  });
});
