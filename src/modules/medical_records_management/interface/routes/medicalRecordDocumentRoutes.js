import express from "express";
const router = express.Router();
import {
  createRecordDocument,
  updateRecordDocument,
  getRecordDocumentById,
  listDocumentsByRecord,
} from "../controllers/MedicalRecordDocumentController.js";

import { uploadMedicalRecordDocument } from "../../../../core/middleware/uploadMedicalRecordDocs.js";
import { requireUser } from "../../../../core/middleware/requireUser.js";
import authMiddleware from "../../../../core/middleware/Auth.js";

import requireActiveSubscription from "../../../../core/middleware/RequireActiveSubscription.js";
/**
 * Upload image for a medical record
 * POST /record/:recordId/upload
 */
router.post(
  "/record/:recordId/upload",
  authMiddleware,
  requireActiveSubscription,
  requireUser,
  uploadMedicalRecordDocument.single("image"),
  createRecordDocument,
);

// Existing routes
router.put("/:id", updateRecordDocument);
router.get("/record/:recordId", listDocumentsByRecord);
router.get("/:id", getRecordDocumentById);

export default router;
