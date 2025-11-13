import bcrypt from "bcrypt";
import User from "../../domain/entities/User.js";
import UserProfile from "../../domain/entities/UserProfile.js";

export default class UserService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async register(data) {
    const { email, password } = data;

    // check existing
    const exists = await this.userRepo.findByEmail(email);
    if (exists) throw new Error("Email already exists");

    // hash pass
    const hashedPassword = await bcrypt.hash(password, 10);

    // Build USER entity
    const user = new User.Builder()
      .setEmail(email)
      .setPassword(hashedPassword)
      .setStatus("Active")
      .build();

    // save user
    const userId = await this.userRepo.createUser(user);

    // Build USER PROFILE entity
    const profile = new UserProfile.Builder()
      .setUserId(userId)
      .setFName(data.f_name)
      .setMName(data.m_name)
      .setLName(data.l_name)
      .setContactNum(data.contact_num)
      .setAddress(data.address)
      .setBirthDate(data.birth_date)
      .build();

    await this.userRepo.createUserProfile(profile);

    return { userId, email };
  }
}
