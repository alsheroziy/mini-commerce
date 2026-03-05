const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");

// ─── Token yaratish ─────────────────────────────────────────────────────────

const generateAccessToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_ACCESS_SECRET || "access_secret",
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

const saveRefreshToken = async (userId, token) => {
  const days = parseInt(process.env.JWT_REFRESH_EXPIRES_DAYS || "30", 10);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  await RefreshToken.create({ user: userId, token, expiresAt });
};

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone,
});

// ─── Auth funksiyalar ────────────────────────────────────────────────────────

const registerUser = async ({ name, email, password, phone }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already in use");

  const user = await User.create({ name, email, password, phone });

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken();
  await saveRefreshToken(user._id.toString(), refreshToken);

  return { user: formatUser(user), tokens: { accessToken, refreshToken } };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid email or password");

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken();
  await saveRefreshToken(user._id.toString(), refreshToken);

  return { user: formatUser(user), tokens: { accessToken, refreshToken } };
};

const refreshTokens = async (token) => {
  const stored = await RefreshToken.findOne({ token }).populate("user");

  if (!stored) throw new Error("Invalid refresh token");
  if (stored.expiresAt < new Date()) {
    await stored.deleteOne();
    throw new Error("Refresh token expired");
  }

  const user = stored.user;

  // Token rotation — eski o'chib yangi yoziladi
  await stored.deleteOne();

  const newAccessToken = generateAccessToken(user._id.toString(), user.role);
  const newRefreshToken = generateRefreshToken();
  await saveRefreshToken(user._id.toString(), newRefreshToken);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const logoutUser = async (token) => {
  await RefreshToken.findOneAndDelete({ token });
};

const logoutAllDevices = async (userId) => {
  await RefreshToken.deleteMany({ user: userId });
};

const getProfile = async (userId) => {
  return User.findById(userId);
};

const updateProfile = async (userId, data) => {
  return User.findByIdAndUpdate(userId, data, { new: true, runValidators: true });
};

module.exports = {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  logoutAllDevices,
  getProfile,
  updateProfile,
};
