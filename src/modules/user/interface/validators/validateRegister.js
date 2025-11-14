export const validateRegister = (req, res, next) => {
  const { email, password, f_name, contact_num } = req.body;

  if (!email || !password || !f_name || !contact_num)
    return res.status(400).json({ error: "Missing required fields" });

  if (!email.includes("@"))
    return res.status(400).json({ error: "Invalid email format" });

  if (password.length < 8)
    return res.status(400).json({ error: "Password too short" });

  next();
};
