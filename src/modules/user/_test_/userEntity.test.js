import User from "../domain/entities/User.js";

describe("User Entity", () => {
  test("should create a valid user with default status 'Active'", () => {
    const user = new User.Builder()
      .setEmail("test@example.com")
      .setPassword("hashedpassword123")
      .build();

    expect(user.email).toBe("test@example.com");
    expect(user.status).toBe("Active");
    expect(user.password).toBe("hashedpassword123");
  });

  test("should throw an error if email is missing", () => {
    expect(() => {
      new User.Builder().setPassword("12345").build();
    }).toThrow("Email and password required");
  });
});
