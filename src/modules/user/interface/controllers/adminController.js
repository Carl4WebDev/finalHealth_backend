/**
 * ADMIN CONTROLLER USING GLOBAL ERROR HANDLING
 *
 * - Uses asyncHandler
 * - No try/catch
 * - DTO → Service → Response
 * - Errors handled globally
 */

import AdminRepo from "../../infrastructure/repositories/AdminRepo.js";
import AuthTokenService from "../../../../core/middleware/AuthTokenService.js";
import AdminService from "../../application/services/AdminService.js";

import RegisterAdminDTO from "../http/dtos/RegisterAdminDTO.js";
import LoginAdminDTO from "../http/dtos/LoginAdminDTO.js";
import AdminResponseDTO from "../http/dtos/AdminResponseDTO.js";

import { sendSuccess } from "../../../../core/http/apiResponse.js";
import { asyncHandler } from "../../../../core/middleware/asyncHandler.js";

import eventBus from "../../../../core/events/EventBus.js";

const adminRepo = new AdminRepo();
const authTokenService = new AuthTokenService();

const adminService = new AdminService(adminRepo, authTokenService, eventBus);

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
  console.log(req.user);
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

export const getAllSubscribers = asyncHandler(async (req, res) => {
  // 🔒 Assumption: admin auth middleware already validated req.admin
  const subscribers = await adminService.getAllSubscribers();

  return sendSuccess(res, {
    data: { subscribers },
  });
});
