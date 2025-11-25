// validateProfile.js (Validation middleware)
export const validateProfile = (req, res, next) => {
  const { fName, mName, lName, contactNum, address, birthDate } = req.body;

  if (!fName || !lName || !contactNum || !address || !birthDate) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required." });
  }

  // Proceed to the next middleware/controller if validation passes
  next();
};
