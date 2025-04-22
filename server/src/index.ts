import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
// import helmet from "helmet";
import cors from "cors";
import path from "path";
import connectDB from "./config/db";
import v1Routes from "./routes/v1/index";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import notFoundMiddleware from "./middlewares/notFound";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import bodyParser from "body-parser";
import multer from "multer";
import { stripeWebhookHandler } from "./controllers/Leads/paymentController";
import asyncHandler from "./utils/asyncHandler";
// leadMOdel 
import { LeadModel } from "./leadModels/leadModel";
import { LeadDomiGrenaModel } from "./leadModels/domiGrenaModel";
import { LeadPortugalModel } from "./leadModels/portugalModel";
import { LeadDubaiModel } from "./leadModels/dubaiModel";
// priority enum
import {leadPriority , leadStatus} from "./types/enums/enums";
// import parsing/ mapping function
import { parseDomiGrenaData } from "./parsingFunctions/domiGrenaParse"
import { parseDubaiData } from "./parsingFunctions/dubaiParse"
import { parsePortugalData } from "./parsingFunctions/portugalParse"
import { getPortugalPriority } from "./priorityFunctions/portugalPriority";
import { getDubaiPriority } from "./priorityFunctions/dubaiPriority";
import { getDomiGrenaPriority } from "./priorityFunctions/domiGrena";
// import priority functions 

dotenv.config();

connectDB();

const app = express();

const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// app.use(helmet());

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(cookieParser());

// register stripe webhook route  before bodyparser middleware
app.post(
  "/api/v1/admin/payment/webhook/stripe",
  express.raw({ type: "application/json" }),
  asyncHandler(stripeWebhookHandler)
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

app.use("/api/v1", v1Routes);

app.get("/health", (req: Request, res: Response): void => {
  logger.info("Health check endpoint hit");
  res.json({ status: "ok" });
});



const FORM_ID_MAP: Record<string, (data: any) => any> = {
  "250912382847462": parsePortugalData,
  "250901425096454": parseDubaiData,
  "250912364956463": parseDomiGrenaData,
};


const PRIORITY_MAP: Record<string, (data: any) => leadPriority> = {
  "250912382847462": getPortugalPriority,
  "250901425096454": getDubaiPriority,
  "250912364956463": getDomiGrenaPriority,
};




// webhook endpoint
app.post("/api/v1/webhook", upload.any(), async (req: Request, res: Response): Promise<void> => {
  
  logger.info("Webhook endpoint hit");
  logger.info("Raw incoming data: " + JSON.stringify(req.body, null, 2));

  const { formID, rawRequest } = req.body;

  if (!rawRequest || typeof rawRequest !== "string") {
    logger.error("rawRequest is missing or not a string");
     res.status(400).json({ status: "error", message: "Invalid or missing rawRequest" });
     return;
  }

  let formData;
  try {
    formData = JSON.parse(rawRequest);
  } catch (error: any) {
    logger.error(`Failed to parse rawRequest: ${error.message}`);
     res.status(400).json({ status: "error", message: "Invalid rawRequest data" });
     return;
  }

  // Step 1: Parse the form data
  const parser = FORM_ID_MAP[formID];
  if (!parser) {
    logger.warn(`No parser found for formID: ${formID}`);
     res.status(400).json({ status: "error", message: "Unrecognized formID" });
     return;
  }

  const parsedData = parser(formData);
  logger.info(`Parsed data for formID ${formID}: ${JSON.stringify(parsedData, null, 2)}`);

  // Step 2: Get priority from form-specific priority function
  const priorityFn = PRIORITY_MAP[formID];
  if (!priorityFn) {
    logger.warn(`No priority function found for formID: ${formID}`);
     res.status(400).json({ status: "error", message: "Priority function not defined" });
     return;
  }

  const priority = priorityFn(parsedData);
  logger.info(`Calculated priority: ${priority}`);

  // Step 3: Extract common + additional fields
  const {
    formId,
    fullName,
    email,
    phone,
    nationality,
    ...rest
  } = parsedData;

  const commonFields = {
    formId,
    fullName,
    email,
    phone,
    nationality
  };

  const additionalInfo = {
    ...rest,
    priority
  };

  // Step 4: Create lead (discriminator model will handle the right schema)
  try {
    let LeadModelToUse;

    switch (formID) {
      case "250912382847462":
        LeadModelToUse = LeadPortugalModel;
        break;
      case "250901425096454":
        LeadModelToUse = LeadDubaiModel;
        break;
      case "250912364956463":
        LeadModelToUse = LeadDomiGrenaModel;
        break;
      default:
         res.status(400).json({ status: "error", message: "Unsupported formID" });
         return;
    }

    const newLead = new LeadModelToUse({
      ...commonFields,
      leadStatus: leadStatus.INITIATED,
      additionalInfo ,
    });

    await newLead.save();

    logger.info("Lead saved successfully");
     res.status(200).json({ status: "success", message: "Lead saved to DB" });
     return;
  } catch (error: any) {
    logger.error("Error saving lead: " + error.message);
     res.status(500).json({ status: "error", message: "Failed to save lead" });
     return;
  }
});








if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "..", "..", "client", "dist");
  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(buildPath, "index.html"));
  });
}

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const args = process.argv.slice(2);
const portArgIndex = args.indexOf("--port");
const PORT =
  portArgIndex !== -1
    ? Number(args[portArgIndex + 1])
    : Number(process.env.PORT) || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));