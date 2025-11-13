import express from "express";
import { register } from "./controllers/userController.js";
import { validateRegister } from "./validators/validateRegister.js";

const router = express.Router();

router.post("/register", validateRegister, register);

export default router;
