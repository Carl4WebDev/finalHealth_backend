import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../domain/entities/User.js";

export default class UserService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async register(email, password) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = new User.Builder().setEmail(email).setPassword(hashed).build();
    return this.userRepo.save(user);
  }

  async login(email, password) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token, user };
  }
}
