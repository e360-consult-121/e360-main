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
const adminSideControllers = __importStar(require("../../../controllers/visaApplications/adminSideController"));
const domiGrenaControllers = __importStar(require("../../../controllers/visaApplications/domiGrenaController"));
const deliveryControllers = __importStar(require("../../../controllers/visaApplications/dgDeliveryController"));
const portugalControllers = __importStar(require("../../../controllers/visaApplications/portugalController"));
const tradeNameControllers = __importStar(require("../../../controllers/visaApplications/DubaiControllers/tradeNameController"));
const moaControllers = __importStar(require("../../../controllers/visaApplications/DubaiControllers/moaController"));
const medicalControllers = __importStar(require("../../../controllers/visaApplications/DubaiControllers/medicalTestController"));
const paymentControllers = __importStar(require("../../../controllers/visaApplications/DubaiControllers/paymentController"));
const s3Upload_1 = require("../../../services/s3Upload");
const router = (0, express_1.Router)();
router.post("/:visaApplicationId/rejectStep", authenticate_1.authenticate, authenticate_1.authorizeAdmin, (0, asyncHandler_1.default)(adminSideControllers.rejectStep));
// ye toh fir bhi only-admin ke liye chal jayega 
router.post("/:reqStatusId/markAsVerified", authenticate_1.authenticate, authenticate_1.authorizeAdmin, (0, asyncHandler_1.default)(adminSideControllers.markAsVerified));
router.post("/:reqStatusId/needsReupload", authenticate_1.authenticate, authenticate_1.authorizeAdmin, (0, asyncHandler_1.default)(adminSideControllers.needsReupload));
// domiGrena investment API'S
router.post("/:stepStatusId/addOptionsForRealState", authenticate_1.authenticate, authenticate_1.authorizeAdmin, (0, asyncHandler_1.default)(domiGrenaControllers.addOptionsForRealState));
// domiGrena Delivery and Shipping API'S
router.post("/:stepStatusId/uploadShippingDetails", authenticate_1.authenticate, authenticate_1.authorizeAdmin, (0, asyncHandler_1.default)(deliveryControllers.uploadShippingDetails));
// Portugal AIMA 
router.post('/:aimaId/updateStatus', authenticate_1.authenticate, authenticate_1.authorizeAdmin, (0, asyncHandler_1.default)(portugalControllers.updateStatus));
// Dubai- Trade Name
router.get('/:stepStatusId/dubai/trade-name/fetchTradeNameOptions', authenticate_1.authenticate, authenticate_1.authorizeAdmin, (0, asyncHandler_1.default)(tradeNameControllers.fetchTradeNameOptions));
router.post('/:stepStatusId/dubai/trade-name/assignOneTradeName', authenticate_1.authenticate, authenticate_1.authorizeAdmin, (0, asyncHandler_1.default)(tradeNameControllers.assignOneTradeName));
router.post('/:stepStatusId/dubai/trade-name/approveChangeReq', authenticate_1.authenticate, authenticate_1.authorizeAdmin, (0, asyncHandler_1.default)(tradeNameControllers.approveChangeReq));
router.post('/:stepStatusId/dubai/trade-name/rejectChangeReq', authenticate_1.authenticate, authenticate_1.authorizeAdmin, (0, asyncHandler_1.default)(tradeNameControllers.rejectChangeReq));
// Dubai - MOA
router.post('/:stepStatusId/dubai/MOA/moaUpload', authenticate_1.authenticate, authenticate_1.authorizeAdmin, s3Upload_1.upload.single("file"), (0, asyncHandler_1.default)(moaControllers.moaUpload));
router.post('/:stepStatusId/dubai/MOA/approveSignature', authenticate_1.authenticate, authenticate_1.authorizeAdmin, (0, asyncHandler_1.default)(moaControllers.approveSignature));
// Dubai - Medical Test
router.post("/:stepStatusId/dubai/medical/uploadMedicalTestDetails", authenticate_1.authenticate, (0, asyncHandler_1.default)(medicalControllers.uploadMedicalTestDetails));
router.post("/:stepStatusId/dubai/medical/markTestAsCompleted", authenticate_1.authenticate, (0, asyncHandler_1.default)(medicalControllers.markTestAsCompleted));
router.post("/:stepStatusId/dubai/medical/approveReschedulingReq", authenticate_1.authenticate, (0, asyncHandler_1.default)(medicalControllers.approveReschedulingReq));
router.post("/:stepStatusId/dubai/medical/approveReschedulingReq", authenticate_1.authenticate, (0, asyncHandler_1.default)(medicalControllers.approveReschedulingReq));
// Dubai - Payment
router.post("/:stepStatusId/dubai/payment/sendPaymentLink", authenticate_1.authenticate, authenticate_1.authorizeAdmin, (0, asyncHandler_1.default)(paymentControllers.handleSendPaymentLink));
exports.default = router;
