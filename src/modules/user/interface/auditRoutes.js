import express from "express";
import { getMyLogs, getAllLogs } from "./controllers/auditController.js";

import authMiddleware from "../../../core/middleware/Auth.js";

// assume you already have auth middleware
// import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// router.use(authMiddleware); // protect all audit routes

router.get("/me", authMiddleware, getMyLogs); // each user sees own activity
router.get("/all", getAllLogs); // only ADMIN in controller

export default router;
