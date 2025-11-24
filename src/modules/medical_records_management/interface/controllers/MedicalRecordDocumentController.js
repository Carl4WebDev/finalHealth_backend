import MedicalRecordDocumentRepo from "../../infrastructure/MedicalRecordDocumentRepo.js";
import MedicalRecordDocumentService from "../../application/services/MedicalRecordDocumentService.js";

import CreateMedicalRecordDocumentDTO from "../http/dtos/CreateMedicalRecordDocumentDTO.js";
import UpdateMedicalRecordDocumentDTO from "../http/dtos/UpdateMedicalRecordDocumentDTO.js";

const documentRepo = new MedicalRecordDocumentRepo();
const documentService = new MedicalRecordDocumentService(documentRepo);

// CREATE
export const createRecordDocument = async (req, res) => {
  try {
    const dto = new CreateMedicalRecordDocumentDTO(req.body);
    const document = await documentService.createDocument(dto);
    res.status(201).json({ success: true, document });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
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
