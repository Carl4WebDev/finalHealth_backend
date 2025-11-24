import express from "express";
import {
  createRecordDocument,
  updateRecordDocument,
  getRecordDocumentById,
  listDocumentsByRecord,
} from "../controllers/MedicalRecordDocumentController.js";

const router = express.Router();

router.post("/", createRecordDocument);
router.put("/:id", updateRecordDocument);

// specific first
router.get("/record/:recordId", listDocumentsByRecord);

router.get("/:id", getRecordDocumentById);

export default router;
