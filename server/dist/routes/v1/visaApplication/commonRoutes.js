"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../../../middlewares/authenticate");
const asyncHandler_1 = __importDefault(require("../../../utils/asyncHandler"));
const clientSideControllers = __importStar(require("../../../controllers/visaApplications/clientSideController"));
const adminSideControllers = __importStar(require("../../../controllers/visaApplications/adminSideController"));
const deliveryControllers = __importStar(require("../../../controllers/visaApplications/dgDeliveryController"));
const moaControllers = __importStar(require("../../../controllers/visaApplications/DubaiControllers/moaController"));
const tradeNameControllers = __importStar(require("../../../controllers/visaApplications/DubaiControllers/tradeNameController"));
const medicalControllers = __importStar(require("../../../controllers/visaApplications/DubaiControllers/medicalTestController"));
const paymentControllers = __importStar(require("../../../controllers/visaApplications/DubaiControllers/paymentController"));
const s3Upload_1 = require("../../../services/s3Upload");
const testingEmails_1 = require("../../../controllers/visaApplications/testingEmails");
const router = (0, express_1.Router)();
router.get("/:visaApplicationId/getCurrentStepInfo", authenticate_1.authenticate, (0, asyncHandler_1.default)(clientSideControllers.getCurrentStepInfo));
router.post("/submitRequirements", authenticate_1.authenticate, (0, asyncHandler_1.default)(clientSideControllers.submitRequirements));
router.post("/:reqStatusId/uploadDocument", authenticate_1.authenticate, s3Upload_1.upload.single("file"), (0, asyncHandler_1.default)(clientSideControllers.uploadDocument));
router.post("/:visaApplicationId/stepSubmit", authenticate_1.authenticate, (0, asyncHandler_1.default)(clientSideControllers.stepSubmit));
router.post("/:visaApplicationId/approveStep", authenticate_1.authenticate, (0, asyncHandler_1.default)(adminSideControllers.approveStep));
// domiGrena investment API'S
// domiGrena Delivery and Shipping API'S
router.get("/:stepStatusId/fetchBothDetails", authenticate_1.authenticate, (0, asyncHandler_1.default)(deliveryControllers.fetchBothDetails));
// Dubai - TradeName
router.get("/:stepStatusId/dubai/trade-name/fetchTradeNameInfo", authenticate_1.authenticate, (0, asyncHandler_1.default)(tradeNameControllers.fetchTradeNameInfo));
// Dubai - MOA
router.get("/:stepStatusId/dubai/moa/fetchSigAndMOA", authenticate_1.authenticate, (0, asyncHandler_1.default)(moaControllers.fetchSigAndMOA));
// Dubai -  Medical
router.get("/:stepStatusId/dubai/medical/fetchMedicalTestInfo", authenticate_1.authenticate, (0, asyncHandler_1.default)(medicalControllers.fetchMedicalTestInfo));
// Dubai -  Payments
router.get("/:stepStatusId/dubai/payment/fetchPaymentInfo", authenticate_1.authenticate, (0, asyncHandler_1.default)(paymentControllers.getPaymentStepInfo));
// route for testing emails 
router.post('/eligibility-form', (0, asyncHandler_1.default)(testingEmails_1.handleEligibilityForm));
exports.default = router;
