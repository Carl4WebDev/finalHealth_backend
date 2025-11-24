import FollowupNoteRepo from "../../infrastructure/FollowupNoteRepo.js";
import FollowupNoteService from "../../application/services/FollowupNoteService.js";

import CreateFollowupNoteDTO from "../http/dtos/CreateFollowupNoteDTO.js";
import UpdateFollowupNoteDTO from "../http/dtos/UpdateFollowupNoteDTO.js";

const followupRepo = new FollowupNoteRepo();
const followupService = new FollowupNoteService(followupRepo);

export const createFollowup = async (req, res) => {
  try {
    const dto = new CreateFollowupNoteDTO(req.body);
    const followup = await followupService.createFollowup(dto);
    res.status(201).json({ success: true, followup });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateFollowup = async (req, res) => {
  try {
    const dto = new UpdateFollowupNoteDTO(req.body, req.params);
    const followup = await followupService.updateFollowup(dto);
    res.status(200).json({ success: true, followup });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getFollowupById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const followup = await followupService.getById(id);

    if (!followup) {
      return res
        .status(404)
        .json({ success: false, error: "Follow-up note not found" });
    }

    res.status(200).json({ success: true, followup });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const listFollowupsByAppointment = async (req, res) => {
  try {
    const appointmentId = Number(req.params.appointmentId);
    const followups = await followupService.listByAppointment(appointmentId);
    res.status(200).json({ success: true, followups });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const listFollowupsByPatient = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);
    const followups = await followupService.listByPatient(patientId);
    res.status(200).json({ success: true, followups });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
