const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/response");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Unauthorized - No token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_ACCESS_SECRET || "access_secret";
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select("_id role");
    if (!user) {
      return sendError(res, "Unauthorized - User not found", 401);
    }

    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch {
    return sendError(res, "Unauthorized - Invalid token", 401);
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, "Forbidden - Insufficient permissions", 403);
    }
    next();
  };
};

module.exports = { protect, restrictTo };
