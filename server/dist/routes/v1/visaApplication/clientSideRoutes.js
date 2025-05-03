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
const domiGrenaControllers = __importStar(require("../../../controllers/visaApplications/domiGrenaController"));
const deliveryControllers = __importStar(require("../../../controllers/visaApplications/dgDeliveryController"));
const tradeNameControllers = __importStar(require("../../../controllers/visaApplications/DubaiControllers/tradeNameController"));
const moaControllers = __importStar(require("../../../controllers/visaApplications/DubaiControllers/moaController"));
const medicalControllers = __importStar(require("../../../controllers/visaApplications/DubaiControllers/medicalTestController"));
const s3Upload_1 = require("../../../services/s3Upload");
const router = (0, express_1.Router)();
router.post("/:visaApplicationId/moveToNextStep", authenticate_1.authenticate, (0, asyncHandler_1.default)(clientSideControllers.moveToNextStep));
// domiGrena investment API'S
router.post("/:stepStatusId/uploadInvoice", authenticate_1.authenticate, s3Upload_1.upload.single("file"), (0, asyncHandler_1.default)(domiGrenaControllers.uploadInvoice));
router.post("/:stepStatusId/selectOption", authenticate_1.authenticate, (0, asyncHandler_1.default)(domiGrenaControllers.selectOption));
// domiGrena Delivery and Shipping API'S
router.post("/:stepStatusId/uploadDeliveryDetails", authenticate_1.authenticate, (0, asyncHandler_1.default)(deliveryControllers.uploadDeliveryDetails));
// Dubai - Trade Name
router.post('/:stepStatusId/dubai/trade-name/uploadTradeNameOptions', authenticate_1.authenticate, (0, asyncHandler_1.default)(tradeNameControllers.uploadTradeNameOptions));
router.post('/:stepStatusId/dubai/trade-name/sendChangeRequest', authenticate_1.authenticate, (0, asyncHandler_1.default)(tradeNameControllers.sendChangeRequest));
router.get('/:stepStatusId/dubai/trade-name/fetchAssignedTradeName', authenticate_1.authenticate, (0, asyncHandler_1.default)(tradeNameControllers.fetchAssignedTradeName));
// Dubai - MOA
router.get('/:stepStatusId/dubai/MOA/moaDocumentFetch', authenticate_1.authenticate, (0, asyncHandler_1.default)(moaControllers.moaDocumentFetch));
router.post('/:stepStatusId/dubai/MOA/uploadSignature', authenticate_1.authenticate, s3Upload_1.upload.single("file"), (0, asyncHandler_1.default)(moaControllers.uploadSignature));
//  Dubai - Medical Test
router.post("/:stepStatusId/dubai/medical/sendReschedulingReq", authenticate_1.authenticate, (0, asyncHandler_1.default)(medicalControllers.sendReschedulingReq));
exports.default = router;
