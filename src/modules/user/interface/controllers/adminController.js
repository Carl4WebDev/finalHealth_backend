import AdminRepo from "../../infrastructure/repositories/AdminRepo.js";
import AuditRepo from "../../infrastructure/repositories/AuditRepo.js";
import AuthTokenService from "../../../../core/middleware/AuthTokenService.js";
import AdminService from "../../application/services/AdminService.js";

import RegisterAdminDTO from "../http/dtos/RegisterAdminDTO.js";
import LoginAdminDTO from "../http/dtos/LoginAdminDTO.js";
import AdminResponseDTO from "../http/dtos/AdminResponseDTO.js";

const adminRepo = new AdminRepo();
const auditRepo = new AuditRepo();
const authTokenService = new AuthTokenService();

const adminService = new AdminService(adminRepo, auditRepo, authTokenService);

export const register = async (req, res) => {
  try {
    const dto = new RegisterAdminDTO(req.body);
    const admin = await adminService.register(dto);

    const adminResponse = new AdminResponseDTO(admin);

    res.status(201).json({ success: true, admin: adminResponse });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const dto = new LoginAdminDTO(req.body);
    const { token, admin } = await adminService.login(dto);
    const adminResponse = new AdminResponseDTO(admin);

    res.status(200).json({ success: true, token, admin: adminResponse });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
