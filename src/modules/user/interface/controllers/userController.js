import UserRepo from "../../infrastructure/repositories/UserRepo.js";
import UserService from "../../application/services/UserService.js";

const userService = new UserService(new UserRepo());

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.register(email, password);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
