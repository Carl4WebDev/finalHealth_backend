export const validateAdminRegister = (req, res, next) => {
  const { fName, lName, email, password } = req.body;

  if (!fName || !lName || !email || !password)
    return res.status(400).json({ error: "Missing required fields" });

  if (!email.includes("@"))
    return res.status(400).json({ error: "Invalid email format" });

  if (password.length < 8)
    return res.status(400).json({ error: "Password too short" });

  next();
};
