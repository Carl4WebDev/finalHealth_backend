import express from "express";
import {
  createNotification,
  markNotificationAsRead,
  listNotificationsByUser,
} from "../controllers/NotificationController.js";

const router = express.Router();

//working
router.post("/", createNotification);
//working
router.put("/:id/read", markNotificationAsRead);
//
router.get("/user/:userId", listNotificationsByUser);

export default router;
