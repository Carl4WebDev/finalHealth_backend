import UserService from "../application/services/UserService.js";
import { jest } from "@jest/globals"; // ← REQUIRED for ESM
// Mock UserRepo
const mockRepo = {
  findByEmail: jest.fn(),
  createUser: jest.fn(),
  createUserProfile: jest.fn(),
};

describe("UserService.register", () => {
  let service;

  beforeEach(() => {
    service = new UserService(mockRepo);
    jest.clearAllMocks();
  });

  test("should register user successfully", async () => {
    mockRepo.findByEmail.mockResolvedValue(null); // no existing user
    mockRepo.createUser.mockResolvedValue(1); // return user_id
    mockRepo.createUserProfile.mockResolvedValue(); // no return

    const data = {
      email: "test@gmail.com",
      password: "12345678",
      f_name: "John",
      m_name: "A",
      l_name: "Doe",
      contact_num: "09123456789",
      address: "123 Main St, Cavite City, Cavite, Philippines, +63",
      birth_date: "2000-01-01",
    };

    const result = await service.register(data);

    expect(result).toEqual({ userId: 1, email: "test@gmail.com" });
    expect(mockRepo.findByEmail).toHaveBeenCalledWith("test@gmail.com");
    expect(mockRepo.createUser).toHaveBeenCalled();
    expect(mockRepo.createUserProfile).toHaveBeenCalled();
  });
});
