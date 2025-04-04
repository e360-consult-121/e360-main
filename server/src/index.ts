import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
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

app.use(helmet());

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

app.use("/api/v1", v1Routes);

app.get("/health", (req: Request, res: Response): void => {
  logger.info("Health check endpoint hit");
  res.json({ status: "ok" });
});

// Webhook 
app.post("/api/v1/webhook", upload.any(), (req: Request, res: Response): void => {
  logger.info("Webhook endpoint hit");
  // raw data 
  logger.info("Raw incoming data: " + JSON.stringify(req.body, null, 2));

  const { formID, rawRequest } = req.body;
  logger.info(`Received formID: ${formID}`);
  logger.info(`Received rawRequest: ${rawRequest}`);

  // Check if rawRequest exists and is a string
  if (!rawRequest || typeof rawRequest !== "string") {
    logger.error("rawRequest is missing or not a string");
    res.status(400).json({ status: "error", message: "Invalid or missing rawRequest" });
    return;
  }

  let formData;
  try {
    // Parse the rawRequest string into a JSON object
    formData = JSON.parse(rawRequest);
    logger.info("Parsed rawRequest successfully");
  } catch (error: any) {
    logger.error(`Failed to parse rawRequest: ${error.message}`);
    res.status(400).json({ status: "error", message: "Invalid rawRequest data" });
    return;
  }

  // Structure the webhook data with meaningful fields
  const webhookData = {
    formId: formID,
    submissionData: {
      fullName: formData.q1_fullName || {},
      nationality: formData.q4_nationality || "",
      email: formData.q6_email || "",
      phone: formData.q61_fullPhone || "",
      purpose: formData.q62_whatsYour62 || [],
      budget: formData.q52_whatBudget || "",
      considering: formData.q54_areYou54 || "",
      criminalRecord: formData.q55_haveYou55 || "",
      additionalInfo: formData.q38_anythingElse || "",
      submitSource: formData.submitSource || "",
      timeToSubmit: formData.timeToSubmit || "",
      eventId: formData.event_id || "",
    },
  };

  // Log the structured data
  logger.info("Structured webhook data: " + JSON.stringify(webhookData, null, 2));

  // Send success response
  res.json({ status: "success" });
  logger.info("Response sent successfully");
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