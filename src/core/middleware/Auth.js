import AuthTokenService from "./AuthTokenService.js";

const tokenService = new AuthTokenService();

export default function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        success: false,
        error: "Missing Authorization header",
      });
    }

    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Invalid Authorization header format",
      });
    }

    const decoded = tokenService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    // Attach decoded user info
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: " + err.message,
    });
  }
}
