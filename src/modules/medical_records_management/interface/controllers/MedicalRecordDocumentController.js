import MedicalRecordDocumentRepo from "../../infrastructure/MedicalRecordDocumentRepo.js";
import MedicalRecordDocumentService from "../../application/services/MedicalRecordDocumentService.js";

import CreateMedicalRecordDocumentDTO from "../http/dtos/CreateMedicalRecordDocumentDTO.js";
import UpdateMedicalRecordDocumentDTO from "../http/dtos/UpdateMedicalRecordDocumentDTO.js";

const documentRepo = new MedicalRecordDocumentRepo();
const documentService = new MedicalRecordDocumentService(documentRepo);

// CREATE
export const createRecordDocument = async (req, res) => {
  try {
    console.log("CONTROLLER HIT");

    console.log("FILE:", req.file);
    console.log("BODY:", req.body);
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }
    console.log("CONTROLLER HIT 0");

    const recordId = parseInt(req.params.recordId, 10);

    if (Number.isNaN(recordId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recordId",
      });
    }

    console.log(req.user.id);
    const uploadedBy = req.user?.id;
    if (!uploadedBy) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized upload",
      });
    }

    const filePath = `/uploads/medical_records/${req.file.filename}`;

    const dto = new CreateMedicalRecordDocumentDTO({
      recordId,
      documentImgPath: filePath,
      uploadedBy,
    });

    const document = await documentService.createDocument(dto);

    res.status(201).json({ success: true, document });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to upload document",
    });
  }
};

// UPDATE
export const updateRecordDocument = async (req, res) => {
  try {
    const dto = new UpdateMedicalRecordDocumentDTO(req.body, req.params);
    const document = await documentService.updateDocument(dto);
    res.status(200).json({ success: true, document });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// GET BY ID
export const getRecordDocumentById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const document = await documentService.getById(id);

    if (!document)
      return res
        .status(404)
        .json({ success: false, error: "Document not found" });

    res.status(200).json({ success: true, document });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// LIST ALL DOCUMENTS FOR A MEDICAL RECORD
export const listDocumentsByRecord = async (req, res) => {
  try {
    const recordId = Number(req.params.recordId);
    const documents = await documentService.listByRecord(recordId);
    res.status(200).json({ success: true, documents });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
