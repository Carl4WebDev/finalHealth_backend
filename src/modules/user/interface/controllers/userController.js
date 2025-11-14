import UserRepo from "../../infrastructure/repositories/UserRepo.js";
import AuditRepo from "../../infrastructure/repositories/AuditRepo.js";
import AuthTokenService from "../../application/utils/AuthTokenService.js";
import UserService from "../../application/services/UserService.js";

const userRepo = new UserRepo();
const auditRepo = new AuditRepo();
const authTokenService = new AuthTokenService();

const userService = new UserService(userRepo, auditRepo, authTokenService);

export const register = async (req, res) => {
  try {
    const result = await userService.register(req.body);
    res.status(201).json({ success: true, user: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { token, user } = await userService.login(
      req.body.email,
      req.body.password
    );
    res.status(200).json({ success: true, token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
