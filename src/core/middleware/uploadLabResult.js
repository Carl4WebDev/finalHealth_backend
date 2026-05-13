import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "src/core/uploads/lab-results",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const uploadLabResult = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
