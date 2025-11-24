import AuditRepo from "../../infrastructure/repositories/AuditRepo.js";
import AuditLogService from "../../application/services/AuditLogService.js";

const auditRepo = new AuditRepo();
const auditService = new AuditLogService(auditRepo);

// REQ042 – user sees own logs
export const getMyLogs = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.adminId;
    const logs = await auditService.getMyLogs(userId);
    res.status(200).json({ success: true, logs });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// REQ043 – admin sees all logs
export const getAllLogs = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN")
      return res.status(403).json({ success: false, error: "Access denied" });

    const logs = await auditService.getAllLogs();
    res.status(200).json({ success: true, logs });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
