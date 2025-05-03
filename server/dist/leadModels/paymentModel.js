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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const leadModel_1 = require("./leadModel");
const enums_1 = require("../types/enums/enums");
const PaymentSchema = new mongoose_1.Schema({
    leadId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: leadModel_1.LeadModel.modelName,
        required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, default: null },
    currency: { type: String,
        enum: ['inr', 'usd', 'eur'],
        default: null
    },
    paymentMethod: { type: String, default: null },
    status: {
        type: String,
        enum: Object.values(enums_1.paymentStatus),
        required: true
    },
    paymentLink: { type: String, required: true },
    invoiceUrl: { type: String, default: null },
    paymentIntentId: { type: String, default: null },
    // sessionId : {type : String , default : null} ,
});
exports.PaymentModel = mongoose_1.default.model('Payment', PaymentSchema);
// 1st stage 
// leadId
// name 
// email
// status
// payment_link
// 2nd stage 
// match by leadId
// paymentIntentId
// sessionId
// amount
// currency 
// status  -->> PAID OR FAILED
// INVOICE_URL , payment_method  :
//  success -->> fetch and set 
//  fail    -->> set null or don't set (automatically set null)
