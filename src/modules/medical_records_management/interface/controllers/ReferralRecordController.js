import ReferralRecordRepo from "../../infrastructure/ReferralRecordRepo.js";
import ReferralRecordService from "../../application/services/ReferralRecordService.js";

import CreateReferralRecordDTO from "../http/dtos/CreateReferralRecordDTO.js";
import UpdateReferralRecordDTO from "../http/dtos/UpdateReferralRecordDTO.js";

const refRepo = new ReferralRecordRepo();
const refService = new ReferralRecordService(refRepo);

export const createReferral = async (req, res) => {
  try {
    const dto = new CreateReferralRecordDTO(req.body);
    const referral = await refService.createReferral(dto);
    res.status(201).json({ success: true, referral });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateReferral = async (req, res) => {
  try {
    const dto = new UpdateReferralRecordDTO(req.body, req.params);
    const referral = await refService.updateReferral(dto);
    res.status(200).json({ success: true, referral });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getReferralById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const referral = await refService.getById(id);

    if (!referral)
      return res
        .status(404)
        .json({ success: false, error: "Referral record not found" });

    res.status(200).json({ success: true, referral });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const listReferralsByAppointment = async (req, res) => {
  try {
    const appointmentId = Number(req.params.appointmentId);
    const referrals = await refService.listByAppointment(appointmentId);
    res.status(200).json({ success: true, referrals });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const listReferralsByPatient = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);
    const referrals = await refService.listByPatient(patientId);
    res.status(200).json({ success: true, referrals });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
