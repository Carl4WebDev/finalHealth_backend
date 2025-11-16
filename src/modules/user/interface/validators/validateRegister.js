export const validateRegister = (req, res, next) => {
  const { email, password, fName, contactNum } = req.body;

  if (!email || !password || !fName || !contactNum) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  if (!email.includes("@")) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid email format" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ success: false, error: "Password too short" });
  }

  next();
};
