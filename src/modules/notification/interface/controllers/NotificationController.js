import NotificationRepo from "../../insfrastructure/NotificationRepo.js";
import NotificationService from "../../application/services/NotificationService.js";

import CreateNotificationDTO from "../http/dtos/CreateNotificationDTO.js";
import MarkAsReadDTO from "../http/dtos/MarkAsReadDTO.js";

const repo = new NotificationRepo();
const service = new NotificationService(repo);

export const createNotification = async (req, res) => {
  try {
    const dto = new CreateNotificationDTO(req.body);
    const notif = await service.create(dto);
    res.status(201).json({ success: true, notif });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const dto = new MarkAsReadDTO(req.params);
    const notif = await service.markAsRead(dto);
    res.status(200).json({ success: true, notif });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const listNotificationsByUser = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const notifs = await service.listByUser(userId);
    res.status(200).json({ success: true, notifs });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
