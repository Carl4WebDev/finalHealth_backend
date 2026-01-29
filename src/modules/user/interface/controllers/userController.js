/**
 * USER CONTROLLER USING GLOBAL ERROR HANDLING
 *
 * EXPLANATION:
 * -------------------------------------------------------------
 * 1. This controller no longer uses try/catch inside every
 *    function. Instead, we wrap each handler with asyncHandler(),
 *    which sends any error to the global errorHandler middleware.
 *
 * 2. All operational/business errors thrown from services
 *    MUST use AppError (e.g., invalid login, duplicate email).
 *    These will be cleanly serialized by errorHandler().
 *
 * 3. All success responses use sendSuccess(), ensuring the API
 *    always returns consistent envelopes:
 *
 *    {
 *      "status": "success",
 *      "message": "...",
 *      "data": { ... }
 *    }
 *
 * 4. This aligns with real SaaS products:
 *    - Stripe → consistent error envelopes
 *    - Supabase → structured error + message + code
 *    - Clerk → consistent success + error arrays
 *
 * 5. Controllers become thin. Zero business logic here.
 *    They only orchestrate: DTO → Service → Response.
 *
 * 6. ANY thrown error goes through:
 *      asyncHandler → errorHandler → final JSON error response
 *
 * This removes duplication, prevents inconsistent responses,
 * and centralizes error management as required in Clean Architecture.
 * -------------------------------------------------------------
 */

import UserRepo from "../../infrastructure/repositories/UserRepo.js";
import AuthTokenService from "../../../../core/middleware/AuthTokenService.js";
import UserService from "../../application/services/UserService.js";

import RegisterUserDTO from "../http/dtos/RegisterDTO.js";
import LoginUserDTO from "../http/dtos/LoginUserDTO.js";
import ChangePasswordDTO from "../http/dtos/ChangePasswordDTO.js";

import { sendSuccess } from "../../../../core/http/apiResponse.js";
import { asyncHandler } from "../../../../core/middleware/asyncHandler.js";

import eventBus from "../../../../core/events/EventBus.js";

// Wiring dependencies
const userRepo = new UserRepo();
const authTokenService = new AuthTokenService();
const userService = new UserService(userRepo, authTokenService, eventBus);

// =============================================================
// REGISTER USER
// =============================================================
export const register = asyncHandler(async (req, res) => {
  const dto = new RegisterUserDTO(req.body);
  const user = await userService.register(dto);

  return sendSuccess(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: { user },
  });
});

// =============================================================
// LOGIN USER
// =============================================================
export const login = asyncHandler(async (req, res) => {
  const dto = new LoginUserDTO(req.body);
  const { token, user } = await userService.login(dto);

  return sendSuccess(res, {
    message: "Login successful",
    data: { token, user },
  });
});

// =============================================================
// UPDATE PROFILE
// =============================================================
export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const payload = {
    fName: req.body.fName,
    mName: req.body.mName,
    lName: req.body.lName,
    contactNum: req.body.contactNum,
    address: req.body.address,
    birthDate: req.body.birthDate,
  };

  const updatedUser = await userRepo.updateProfile(userId, payload);

  return sendSuccess(res, {
    message: "User profile updated",
    data: { user: updatedUser },
  });
});

// =============================================================
// FETCH USER PERSONAL INFO
// =============================================================
export const getUserPersonalInfo = asyncHandler(async (req, res) => {
  const userId = Number(req.user.id);
  const userInfo = await userService.getUserPersonalInfo(userId);

  return sendSuccess(res, {
    data: { userInfo },
  });
});

// =============================================================
// CHANGE PASSWORD
// =============================================================
export const changePassword = asyncHandler(async (req, res) => {
  const userId = Number(req.user.id);
  const dto = new ChangePasswordDTO(req.body);

  const result = await userService.changePassword(userId, dto);

  return sendSuccess(res, {
    message: "Password updated successfully",
    data: result,
  });
});

// =============================================================
// UPLOAD PROFILE IMAGE
// =============================================================
export const uploadProfileImage = asyncHandler(async (req, res) => {
  const userId = Number(req.user.id);

  if (!req.file) {
    throw new AppError("No file uploaded", 400, "NO_FILE_UPLOADED");
  }

  const filePath = `/uploads/profile/${req.file.filename}`;
  await userService.updateProfileImage(userId, filePath);

  return sendSuccess(res, {
    message: "Profile image updated",
    data: { profileImgPath: filePath },
  });
});

// =============================================================
// UPDATE ACCOUNT SETTINGS
// =============================================================
export const updateSettings = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const currentPassword = req.body.currentPassword?.trim();
  const newPassword = req.body.newPassword?.trim();

  const payload = {
    currentPassword,
    newPassword,
    profileImgPath: req.file.filename,
  };

  const result = await userService.updateSettings(userId, payload);

  return sendSuccess(res, {
    message: "Settings updated",
    data: { user: result },
  });
});
