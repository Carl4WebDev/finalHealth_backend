import QueueRepository from "../../infrastructure/QueueRepository.js";
import PriorityRepo from "../../infrastructure/PriorityRepo.js";
import QueueService from "../../application/services/QueueService.js";
import AuditRepo from "../../../user/infrastructure/repositories/AuditRepo.js";
import AuditLogService from "../../../user/application/services/AuditLogService.js";
import AddToQueueDTO from "../http/AddToQueueDTO.js";

const queueRepo = new QueueRepository();
const priorityRepo = new PriorityRepo();
const auditRepo = new AuditRepo();
const auditService = new AuditLogService(auditRepo);

const queueService = new QueueService(queueRepo, priorityRepo, auditService);

// Controller for handling the add to queue request
export const addToQueue = async (req, res) => {
  try {
    // Make sure to validate and format the data correctly in the DTO
    const dto = new AddToQueueDTO(req.body);

    // Perform the action to add the patient to the queue
    const result = await queueService.addToQueue(dto, req.user);

    // Respond with success and the entry information
    res.status(201).json({ success: true, entry: result });
  } catch (err) {
    // Send an error response if something goes wrong
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getQueue = async (req, res) => {
  try {
    const doctorId = Number(req.params.doctorId);
    const clinicId = Number(req.params.clinicId);

    const result = await queueService.listQueue(doctorId, clinicId);

    res.status(200).json({ success: true, queue: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateQueueStatus = async (req, res) => {
  try {
    const queueEntryId = Number(req.params.id);
    const { status } = req.body;

    const entry = await queueService.updateStatus(
      queueEntryId,
      status,
      req.user
    );

    res.status(200).json({ success: true, entry });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
