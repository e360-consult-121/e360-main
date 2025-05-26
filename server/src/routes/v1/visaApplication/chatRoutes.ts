import express, { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as chatControllers from "../../../controllers/chatControllers/chatController";
import {upload} from "../../../services/s3Upload"


const router = Router();


// Document Vault
router.post("/:visaApplicationId/messageSend" , authenticate , asyncHandler(chatControllers.msgSend)  );
router.get("/:visaApplicationId/fetchChatMsgs", authenticate , asyncHandler(chatControllers.fetchAllMsg)  );
router.post("/:visaApplicationId/uploadFile" , authenticate ,upload.single("file"), asyncHandler(chatControllers.uploadFile)  );
router.post("/:visaApplicationId/moveToDocVault", authenticate ,authorizeAdmin ,asyncHandler(chatControllers.moveToDocVault)  );

export default router;