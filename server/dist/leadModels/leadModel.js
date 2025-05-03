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
exports.LeadModel = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../types/enums/enums");
const LeadSchema = new mongoose_1.Schema({
    formId: { type: String, required: true },
    fullName: {
        first: { type: String, required: true },
        last: { type: String, required: true },
    },
    nationality: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    leadStatus: {
        type: String,
        enum: Object.values(enums_1.leadStatus),
        default: enums_1.leadStatus.INITIATED,
    },
    additionalInfo: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
    reasonOfRejection: {
        type: String,
        default: null
    },
    caseId: {
        type: String,
        unique: true,
        // required: true,
    }
}, { timestamps: true });
LeadSchema.pre("save", async function (next) {
    const lead = this;
    // Only generate caseId if it's a new document
    if (lead.isNew) {
        let caseId;
        let exists = true;
        do {
            // Using dynamic import for nanoid
            const { nanoid } = await Promise.resolve().then(() => __importStar(require('nanoid')));
            const shortId = nanoid(6).toUpperCase(); // e.g., A7C8X9
            const year = new Date().getFullYear();
            caseId = `E360-${year}-${shortId}`;
            const existing = await exports.LeadModel.exists({ caseId });
            exists = existing !== null;
        } while (exists);
        lead.caseId = caseId;
    }
    next();
});
exports.LeadModel = (0, mongoose_1.model)("Lead", LeadSchema);
