import jwt from "jsonwebtoken";

export default class AuthTokenService {
  generateToken(user) {
    return jwt.sign(
      { id: user.userId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return null;
    }
  }

  isExpired(token) {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  }
}
