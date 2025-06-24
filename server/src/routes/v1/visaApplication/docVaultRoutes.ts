import express, { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as docVaultControllers from "../../../controllers/visaApplications/docVaultController";
import {upload} from "../../../services/s3Upload"
import { handleEligibilityForm } from "../../../controllers/visaApplications/testingEmails"

const router = Router();


// Document Vault
router.get("/:visaApplicationId/fetchVaultDocS"  , authenticate , asyncHandler(docVaultControllers.fetchVaultDocS)  );
router.post("/:visaApplicationId/addCategory"    , authenticate , authorizeAdmin , asyncHandler(docVaultControllers.createCategory)  );
router.post("/:visaApplicationId/docUploadByUser", authenticate , upload.single("file"), asyncHandler(docVaultControllers.docUploadByUser)  );
router.post("/:categoryId/docUploadByAdmin"      , authenticate , authorizeAdmin ,upload.single("file"),  asyncHandler(docVaultControllers.uploadDocumentToCategory)  );
router.post("/:documentId/moveToAnotherCategory" , authenticate , authorizeAdmin, asyncHandler(docVaultControllers.moveDocumentToAnotherCategory)  );
router.get("/:visaApplicationId/fetchAllExtraCategories" , authenticate , authorizeAdmin, asyncHandler(docVaultControllers.fetchAllExtraCategories)  );

export default router;