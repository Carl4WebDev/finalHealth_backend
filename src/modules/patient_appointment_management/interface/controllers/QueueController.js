/**
 * QUEUE CONTROLLER
 * - No try/catch
 * - No audit imports
 * - asyncHandler only
 */

import QueueRepository from "../../infrastructure/QueueRepository.js";
import PriorityRepo from "../../infrastructure/PriorityRepo.js";
import QueueService from "../../application/services/QueueService.js";

import AddToQueueDTO from "../http/AddToQueueDTO.js";

import eventBus from "../../../../core/events/EventBus.js";
import { asyncHandler } from "../../../../core/middleware/asyncHandler.js";
import { sendSuccess } from "../../../../core/http/apiResponse.js";

// DI
const queueRepo = new QueueRepository();
const priorityRepo = new PriorityRepo();

const queueService = new QueueService(queueRepo, priorityRepo, eventBus);

// ============================================================
// ADD TO QUEUE
// ============================================================
export const addToQueue = asyncHandler(async (req, res) => {
  const dto = new AddToQueueDTO(req.body);
  const entry = await queueService.addToQueue(dto, req.user);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Patient added to queue",
    data: { entry },
  });
});

// ============================================================
// GET QUEUE
// ============================================================
export const getQueueOfDoctorInClinic = asyncHandler(async (req, res) => {
  const doctorId = Number(req.params.doctorId);
  const clinicId = Number(req.params.clinicId);

  const { normalQueue, priorityQueue } =
    await queueService.getQueueOfDoctorInClinic(doctorId, clinicId);

  return sendSuccess(res, {
    data: {
      normalQueue,
      priorityQueue,
    },
  });
});

// ============================================================
// UPDATE QUEUE STATUS
// ============================================================
export const updateQueueStatus = asyncHandler(async (req, res) => {
  const queueEntryId = Number(req.params.queueId);
  const { status } = req.body;

  const entry = await queueService.updateStatus(queueEntryId, status, req.user);

  return sendSuccess(res, {
    message: "Queue status updated",
    data: { entry },
  });
});
