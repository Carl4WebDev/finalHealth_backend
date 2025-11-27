import UserRepo from "../../infrastructure/repositories/UserRepo.js";
import AuditRepo from "../../infrastructure/repositories/AuditRepo.js";
import AuthTokenService from "../../../../core/middleware/AuthTokenService.js";
import UserService from "../../application/services/UserService.js";

import RegisterUserDTO from "../http/dtos/RegisterDTO.js";
import LoginUserDTO from "../http/dtos/LoginUserDTO.js";
import UserResponseDTO from "../http/dtos/UserResponseDTO.js";
import ChangePasswordDTO from "../http/dtos/ChangePasswordDTO.js";

// Wiring dependencies (you can move this to a DI container later)
const userRepo = new UserRepo();
const auditRepo = new AuditRepo();
const authTokenService = new AuthTokenService();

const userService = new UserService(userRepo, auditRepo, authTokenService);

export const register = async (req, res) => {
  try {
    const dto = new RegisterUserDTO(req.body);
    const user = await userService.register(dto);
    const userResponse = new UserResponseDTO(user);

    res.status(201).json({ success: true, user: userResponse });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const dto = new LoginUserDTO(req.body);
    const { token, user } = await userService.login(dto);
    const userResponse = new UserResponseDTO(user);

    res.status(200).json({ success: true, token, user: userResponse });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Controller for updating the user's profile (excluding email)
export const updateUserProfile = async (req, res) => {
  const userId = req.params.userId; // Get user ID from params
  const { fName, mName, lName, contactNum, address, birthDate } = req.body; // Get the new profile data

  try {
    // Pass the data to the service layer
    const updatedUser = await userService.updateProfile(userId, {
      fName,
      mName,
      lName,
      contactNum,
      address,
      birthDate,
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getUserPersonalInfo = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const userInfo = await userService.getUserPersonalInfo(userId);
    res.status(200).json({ success: true, userInfo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const dto = new ChangePasswordDTO(req.body);
    console.log(userId);
    console.log(dto);

    const result = await userService.changePassword(userId, dto);

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    console.log(userId);

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const filePath = `/uploads/profile/${req.file.filename}`;

    const updated = await userService.updateProfileImage(userId, filePath);

    res.status(200).json({
      success: true,
      message: "Profile image updated",
      profileImgPath: filePath,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const payload = {
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
      profileImgPath: req.file ? req.file.filename : undefined,
    };

    const result = await userService.updateSettings(userId, payload);

    res.status(200).json({
      success: true,
      message: "Settings updated",
      user: result,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
