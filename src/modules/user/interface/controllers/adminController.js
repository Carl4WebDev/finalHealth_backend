/**
 * ADMIN CONTROLLER USING GLOBAL ERROR HANDLING
 *
 * - Uses asyncHandler
 * - No try/catch
 * - DTO → Service → Response
 * - Errors handled globally
 */

import AdminRepo from "../../infrastructure/repositories/AdminRepo.js";
import AuditRepo from "../../infrastructure/repositories/AuditRepo.js";
import AuthTokenService from "../../../../core/middleware/AuthTokenService.js";
import AdminService from "../../application/services/AdminService.js";

import RegisterAdminDTO from "../http/dtos/RegisterAdminDTO.js";
import LoginAdminDTO from "../http/dtos/LoginAdminDTO.js";
import AdminResponseDTO from "../http/dtos/AdminResponseDTO.js";

import { sendSuccess } from "../../../../core/http/apiResponse.js";
import { asyncHandler } from "../../../../core/middleware/asyncHandler.js";

const adminRepo = new AdminRepo();
const auditRepo = new AuditRepo();
const authTokenService = new AuthTokenService();

const adminService = new AdminService(adminRepo, auditRepo, authTokenService);

// ============================================================
// REGISTER ADMIN
// ============================================================
export const register = asyncHandler(async (req, res) => {
  const dto = new RegisterAdminDTO(req.body);
  const admin = await adminService.register(dto);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Admin registered successfully",
    data: { admin: new AdminResponseDTO(admin) },
  });
});

// ============================================================
// LOGIN ADMIN
// ============================================================
export const login = asyncHandler(async (req, res) => {
  const dto = new LoginAdminDTO(req.body);
  const { token, admin } = await adminService.login(dto);

  return sendSuccess(res, {
    message: "Admin login successful",
    data: {
      token,
      admin: new AdminResponseDTO(admin),
    },
  });
});
