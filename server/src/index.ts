import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan"; // Logger middleware
import helmet from "helmet";
import cors from "cors";
import path from "path";
import connectDB from "./config/db";
import v1Routes from "./routes/v1/index";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import notFoundMiddleware from "./middlewares/notFound";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import bodyParser from "body-parser"; // Import body-parser

dotenv.config();

connectDB();

const app = express();

const morganFormat = ":method :url :status :response-time ms";

// Morgan middleware for logging HTTP requests
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

// Add body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1", v1Routes);

app.post("/api/v1/webhook", (req: Request, res: Response) => {
  const data = req.body;
  console.log("Received Webhook Data:", JSON.stringify(data, null, 2));

  res.json({ status: "success" });
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

// Dynamic Port Handling
const args = process.argv.slice(2);
const portArgIndex = args.indexOf("--port");
const PORT =
  portArgIndex !== -1
    ? Number(args[portArgIndex + 1])
    : Number(process.env.PORT) || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
