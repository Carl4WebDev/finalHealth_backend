import UserRepo from "../../infrastructure/repositories/UserRepo.js";
import UserService from "../../application/services/UserService.js";

// ⬅️ RIGHT HERE — INSTANTIATE & INJECT
const userRepo = new UserRepo();
const userService = new UserService(userRepo);

export const register = async (req, res) => {
  try {
    const result = await userService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: result,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
