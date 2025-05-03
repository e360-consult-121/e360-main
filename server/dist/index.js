"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
// import helmet from "helmet";
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./config/db"));
const index_1 = __importDefault(require("./routes/v1/index"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("./utils/logger"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const paymentController_1 = require("./controllers/Leads/paymentController");
const asyncHandler_1 = __importDefault(require("./utils/asyncHandler"));
const grenadaModel_1 = require("./leadModels/grenadaModel");
const dominicaModel_1 = require("./leadModels/dominicaModel");
const portugalModel_1 = require("./leadModels/portugalModel");
const dubaiModel_1 = require("./leadModels/dubaiModel");
// priority enum
const enums_1 = require("./types/enums/enums");
// import parsing/ mapping function
const domiGrenaParse_1 = require("./parsingFunctions/domiGrenaParse");
const dubaiParse_1 = require("./parsingFunctions/dubaiParse");
const portugalParse_1 = require("./parsingFunctions/portugalParse");
const portugalPriority_1 = require("./priorityFunctions/portugalPriority");
const dubaiPriority_1 = require("./priorityFunctions/dubaiPriority");
const domiGrena_1 = require("./priorityFunctions/domiGrena");
const highPriority_1 = require("./services/emails/triggers/leads/eligibility-form-filled/highPriority");
const mediumPriority_1 = require("./services/emails/triggers/leads/eligibility-form-filled/mediumPriority");
const lowPriority_1 = require("./services/emails/triggers/leads/eligibility-form-filled/lowPriority");
const priorityTrigger_1 = require("./services/emails/triggers/admin/eligibility-form-filled/priorityTrigger");
// import priority functions
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
const morganFormat = ":method :url :status :response-time ms";
app.use((0, morgan_1.default)(morganFormat, {
    stream: {
        write: (message) => {
            const logObject = {
                method: message.split(" ")[0],
                url: message.split(" ")[1],
                status: message.split(" ")[2],
                responseTime: message.split(" ")[3],
            };
            logger_1.default.info(JSON.stringify(logObject));
        },
    },
}));
// app.use(helmet());
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
// register stripe webhook route  before bodyparser middleware
app.post("/api/v1/admin/payment/webhook/stripe", express_1.default.raw({ type: "application/json" }), (0, asyncHandler_1.default)(paymentController_1.stripeWebhookHandler));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/api/v1", index_1.default);
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
app.get("/health", (req, res) => {
    logger_1.default.info("Health check endpoint hit");
    res.json({ status: "ok" });
});
const FORM_ID_MAP = {
    "250912382847462": portugalParse_1.parsePortugalData,
    "250901425096454": dubaiParse_1.parseDubaiData,
    "250912364956463": domiGrenaParse_1.parseDomiGrenaData,
};
const PRIORITY_MAP = {
    "250912382847462": portugalPriority_1.getPortugalPriority,
    "250901425096454": dubaiPriority_1.getDubaiPriority,
    "250912364956463": domiGrena_1.getDomiGrenaPriority,
};
// webhook endpoint
app.post("/api/v1/webhook", upload.any(), async (req, res) => {
    logger_1.default.info("Webhook endpoint hit");
    logger_1.default.info("Raw incoming data: " + JSON.stringify(req.body, null, 2));
    const { formID, rawRequest } = req.body;
    if (!rawRequest || typeof rawRequest !== "string") {
        logger_1.default.error("rawRequest is missing or not a string");
        res
            .status(400)
            .json({ status: "error", message: "Invalid or missing rawRequest" });
        return;
    }
    let formData;
    try {
        formData = JSON.parse(rawRequest);
    }
    catch (error) {
        logger_1.default.error(`Failed to parse rawRequest: ${error.message}`);
        res
            .status(400)
            .json({ status: "error", message: "Invalid rawRequest data" });
        return;
    }
    // Step 1: Parse the form data
    const parser = FORM_ID_MAP[formID];
    if (!parser) {
        logger_1.default.warn(`No parser found for formID: ${formID}`);
        res.status(400).json({ status: "error", message: "Unrecognized formID" });
        return;
    }
    const parsedData = parser(formData);
    logger_1.default.info(`Parsed data for formID ${formID}: ${JSON.stringify(parsedData, null, 2)}`);
    // Step 2: Get priority from form-specific priority function
    const priorityFn = PRIORITY_MAP[formID];
    if (!priorityFn) {
        logger_1.default.warn(`No priority function found for formID: ${formID}`);
        res
            .status(400)
            .json({ status: "error", message: "Priority function not defined" });
        return;
    }
    const priority = priorityFn(parsedData);
    logger_1.default.info(`Calculated priority: ${priority}`);
    // Step 3: Extract common + additional fields
    const { formId, fullName, email, phone, nationality, ...rest } = parsedData;
    const commonFields = {
        formId,
        fullName,
        email,
        phone,
        nationality,
    };
    const additionalInfo = {
        ...rest,
        priority,
    };
    // Step 4: Create lead (discriminator model will handle the right schema)
    let serviceType = "";
    try {
        let LeadModelToUse;
        switch (formID) {
            case "250912382847462":
                LeadModelToUse = portugalModel_1.LeadPortugalModel;
                serviceType = "Portugal D7 Visa";
                break;
            case "250901425096454":
                LeadModelToUse = dubaiModel_1.LeadDubaiModel;
                serviceType = "Dubai Business Setup";
                break;
            // case "250912364956463":
            //   LeadModelToUse = LeadDomiGrenaModel;
            //   break;
            case "250912364956463":
                // Check visaType inside parsed data
                if (parsedData.visaTypeName === "DOMINICA") {
                    LeadModelToUse = dominicaModel_1.LeadDominicaModel;
                    serviceType = "Dominica Passport";
                }
                else if (parsedData.visaTypeName === "GRENADA") {
                    LeadModelToUse = grenadaModel_1.LeadGrenadaModel;
                    serviceType = "Grenada Passport";
                }
                else {
                    res.status(400).json({
                        status: "error",
                        message: "Unknown visa type in form data",
                    });
                    return;
                }
                break;
            default:
                res
                    .status(400)
                    .json({ status: "error", message: "Unsupported formID" });
                return;
        }
        const newLead = new LeadModelToUse({
            ...commonFields,
            leadStatus: enums_1.leadStatus.INITIATED,
            additionalInfo,
        });
        await newLead.save();
        const calendlyLink = `${process.env.CALENDLY_LINK}?utm_campaign=${newLead._id}&utm_source=EEE360`;
        await (0, priorityTrigger_1.leadEmailToAdmin)(newLead.fullName.first, serviceType, priority);
        if (priority === enums_1.leadPriority.HIGH) {
            await (0, highPriority_1.sendHighPriorityLeadEmail)(newLead.email, newLead.fullName.first, serviceType, calendlyLink);
        }
        else if (priority === enums_1.leadPriority.MEDIUM) {
            await (0, mediumPriority_1.sendMediumPriorityLeadEmail)(newLead.email, newLead.fullName.first, serviceType, calendlyLink);
        }
        else if (priority === enums_1.leadPriority.LOW) {
            await (0, lowPriority_1.sendLowPriorityLeadEmail)(newLead.email, newLead.fullName.first, serviceType, "", "");
        }
        logger_1.default.info("Lead saved successfully :", newLead);
        res.status(200).json({ status: "success", message: "Lead saved to DB" });
        return;
    }
    catch (error) {
        logger_1.default.error("Error saving lead: " + error.message);
        res.status(500).json({ status: "error", message: "Failed to save lead" });
        return;
    }
});
if (process.env.NODE_ENV === "production") {
    const buildPath = path_1.default.join(__dirname, "..", "..", "client", "dist");
    app.use(express_1.default.static(buildPath));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.resolve(buildPath, "index.html"));
    });
}
app.use(notFound_1.default);
app.use(errorHandler_1.default);
const args = process.argv.slice(2);
const portArgIndex = args.indexOf("--port");
const PORT = portArgIndex !== -1
    ? Number(args[portArgIndex + 1])
    : Number(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
