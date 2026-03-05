const authService = require("../services/auth.service");
const { sendSuccess, sendError } = require("../utils/response");

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendSuccess(res, result, "User registered successfully", 201);
  } catch (error) {
    const msg = error.message || "Registration failed";
    return sendError(res, msg, msg === "Email already in use" ? 409 : 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return sendSuccess(res, result, "Login successful");
  } catch (error) {
    return sendError(res, error.message || "Login failed", 401);
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, "Refresh token is required", 400);
    const tokens = await authService.refreshTokens(refreshToken);
    return sendSuccess(res, tokens, "Tokens refreshed successfully");
  } catch (error) {
    const msg = error.message || "Token refresh failed";
    const status = msg.includes("expired") || msg.includes("Invalid") ? 401 : 500;
    return sendError(res, msg, status);
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, "Refresh token is required", 400);
    await authService.logoutUser(refreshToken);
    return sendSuccess(res, null, "Logged out successfully");
  } catch (error) {
    return sendError(res, error.message || "Logout failed");
  }
};

const logoutAll = async (req, res) => {
  try {
    await authService.logoutAllDevices(req.user.id);
    return sendSuccess(res, null, "Logged out from all devices");
  } catch (error) {
    return sendError(res, error.message || "Logout failed");
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    if (!user) return sendError(res, "User not found", 404);
    return sendSuccess(res, user, "Profile fetched");
  } catch (error) {
    return sendError(res, error.message || "Error fetching profile");
  }
};

const updateMe = async (req, res) => {
  try {
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
    const data = { ...req.body, ...(avatar && { avatar }) };
    const user = await authService.updateProfile(req.user.id, data);
    return sendSuccess(res, user, "Profile updated");
  } catch (error) {
    return sendError(res, error.message || "Error updating profile");
  }
};

module.exports = { register, login, refresh, logout, logoutAll, getMe, updateMe };
