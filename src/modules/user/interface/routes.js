import express from "express";
import { register, login } from "./controllers/userController.js";
import { validateRegister } from "./validators/validateRegister.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", login);

export default router;
