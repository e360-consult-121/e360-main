import express, { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as docVaultControllers from "../../../controllers/visaApplications/docVaultController";
import {upload} from "../../../services/s3Upload"
import { handleEligibilityForm } from "../../../controllers/visaApplications/testingEmails"

const router = Router();


// Document Vault
router.get("/:visaApplicationId/fetchVaultDocS",authenticate ,asyncHandler(docVaultControllers.fetchVaultDocS)  );
router.post("/:visaApplicationId/addCategory",authenticate ,authorizeAdmin , asyncHandler(docVaultControllers.createCategory)  );
router.post("/:visaApplicationId/docUploadByUser",authenticate ,asyncHandler(docVaultControllers.docUploadByUser)  );
router.post("/:categoryId/docUploadByAdmin",authenticate ,asyncHandler(docVaultControllers.uploadDocumentToCategory)  );
router.post("/:documentId/moveToAnotherCategory",authenticate ,asyncHandler(docVaultControllers.moveDocumentToAnotherCategory)  );

export default router;