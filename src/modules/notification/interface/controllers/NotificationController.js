import NotificationRepo from "../../insfrastructure/NotificationRepo.js";
import NotificationService from "../../application/services/NotificationService.js";

import CreateNotificationDTO from "../http/dtos/CreateNotificationDTO.js";
import MarkAsReadDTO from "../http/dtos/MarkAsReadDTO.js";

// AUDIT
import AuditRepo from "../../../user/infrastructure/repositories/AuditRepo.js";
import AuditLogService from "../../../user/application/services/AuditLogService.js";

// DI
const repo = new NotificationRepo();
const auditRepo = new AuditRepo();
const auditService = new AuditLogService(auditRepo);

const service = new NotificationService(repo, auditService);

// CREATE NOTIFICATION
export const createNotification = async (req, res) => {
  try {
    const dto = new CreateNotificationDTO(req.body);

    const notif = await service.create(dto, req.user);

    res.status(201).json({ success: true, notif });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// MARK AS READ
export const markNotificationAsRead = async (req, res) => {
  try {
    const dto = new MarkAsReadDTO(req.params);

    const notif = await service.markAsRead(dto, req.user);

    res.status(200).json({ success: true, notif });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// LIST NOTIFICATIONS FOR USER
export const listNotificationsByUser = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const notifs = await service.listByUser(userId);

    res.status(200).json({ success: true, notifs });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
