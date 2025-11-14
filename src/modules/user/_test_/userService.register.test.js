import UserService from "../application/services/UserService.js";
import { jest } from "@jest/globals";

// Mocks
const mockRepo = {
  findByEmail: jest.fn(),
  createUser: jest.fn(),
  createUserProfile: jest.fn(),
};

const mockAudit = { logAuth: jest.fn() };
const mockToken = { generateToken: jest.fn() };

describe("UserService.register()", () => {
  let service;

  beforeEach(() => {
    service = new UserService(mockRepo, mockAudit, mockToken);
    jest.clearAllMocks();
  });

  test("register_userValidData_userRegisteredSuccessfully", async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.createUser.mockResolvedValue(1);
    mockRepo.createUserProfile.mockResolvedValue();

    const input = {
      email: "test@gmail.com",
      password: "12345678",
      f_name: "John",
      m_name: "A",
      l_name: "Doe",
      contact_num: "09123456789",
      address: "Cavite",
      birth_date: "2000-01-01",
    };

    const result = await service.register(input);

    expect(result).toEqual({ userId: 1, email: "test@gmail.com" });
  });

  test("register_emailAlreadyExists_throwError", async () => {
    mockRepo.findByEmail.mockResolvedValue({ user_id: 1 });

    await expect(
      service.register({ email: "test@gmail.com", password: "12345678" })
    ).rejects.toThrow("Email already exists");
  });
});
