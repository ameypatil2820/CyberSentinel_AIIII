/*
 Author: Balaji Patil
 GitHub: github.com/BalajiPatil1207
*/

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import ApiResponse, { sendSuccess, sendCreated, sendPaginated } from "./utils/apiResponse.js";
import ApiError, { throwBadRequest, throwUnauthorized, throwForbidden, throwNotFound, throwInternal } from "./utils/ApiError.js";
import authRoutes from "./routes/authRoutes.js";
import threatRoutes from "./routes/threatRoutes.js";
import incidentRoutes from "./routes/incidentRoutes.js";
import securityRoutes from "./routes/securityRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT"]
  }
});

// Store socket.io instance in Express app context
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);
  
  socket.on("disconnect", () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Secure headers via Helmet
app.use(helmet({ crossOriginResourcePolicy: false }));

// Rate Limiting to prevent brute-force attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests from this IP address. Please try again after 15 minutes."
  }
});
app.use("/api", apiLimiter);

// Set up middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Serve uploads statically
app.use("/uploads", express.static(path.join(__dirname, "upload")));

// Auth routes
app.use("/api/auth", authRoutes);

// Cybersecurity routes
app.use("/api/threats", threatRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/settings", settingRoutes);

// Root route (Health check)
app.get("/", (req, res) => {
  res.json({
    status: "active",
    message: "CyberSentinel AI API server is running.",
    timestamp: new Date(),
  });
});

// Test success response route
app.get("/api/test-success", (req, res) => {
  const testData = {
    appName: "CyberSentinel AI",
    status: "Healthy",
    features: ["Phishing Detection", "Vulnerability Scanner", "Threat Monitoring"],
  };
  return res
    .status(200)
    .json(new ApiResponse(200, testData, "Test details fetched successfully!"));
});

// Test custom ApiError throwing route
app.get("/api/test-error", (req, res, next) => {
  try {
    throw new ApiError(400, "This is a custom API test error message.", [
      "Detail 1: Check inputs",
      "Detail 2: Database validation error mock",
    ]);
  } catch (error) {
    next(error);
  }
});

// Test Mongoose CastError route
app.get("/api/test-cast-error", (req, res, next) => {
  try {
    const TempModel = mongoose.models.Temp || mongoose.model("Temp", new mongoose.Schema({ name: String }));
    TempModel.findById("invalid-id")
      .then((doc) => res.json(doc))
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

// Test sendSuccess helper
app.get("/api/test-send-success", (req, res) => {
  const users = [
    { id: 1, name: "Alice", role: "Admin" },
    { id: 2, name: "Bob", role: "User" }
  ];
  sendSuccess(res, users, "Users fetched successfully using helper!");
});

// Test sendCreated helper (201)
app.post("/api/test-send-created", (req, res) => {
  const newUser = { id: 3, name: "Charlie", role: "User" };
  sendCreated(res, newUser, "User profile created successfully!");
});

// Test sendPaginated helper
app.get("/api/test-send-paginated", (req, res) => {
  const { page = 1, limit = 2 } = req.query;
  const mockDatabaseItems = [
    { id: 1, name: "Threat Log A", severity: "High" },
    { id: 2, name: "Threat Log B", severity: "Low" },
    { id: 3, name: "Threat Log C", severity: "Critical" },
    { id: 4, name: "Threat Log D", severity: "Medium" },
    { id: 5, name: "Threat Log E", severity: "High" }
  ];
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedItems = mockDatabaseItems.slice(startIndex, endIndex);
  
  sendPaginated(res, paginatedItems, page, limit, mockDatabaseItems.length, "Paginated threat logs retrieved successfully!");
});

// Test throwNotFound helper (404)
app.get("/api/test-throw-notfound", (req, res, next) => {
  try {
    throwNotFound("The requested security rule could not be found.");
  } catch (error) {
    next(error);
  }
});

// Test throwForbidden helper (403)
app.get("/api/test-throw-forbidden", (req, res, next) => {
  try {
    throwForbidden("You do not have administrative permissions to modify security rules.");
  } catch (error) {
    next(error);
  }
});

// Test throwUnauthorized helper (401)
app.get("/api/test-throw-unauthorized", (req, res, next) => {
  try {
    throwUnauthorized("Missing or expired authentication token.");
  } catch (error) {
    next(error);
  }
});

// Test throwBadRequest helper (400)
app.get("/api/test-throw-badrequest", (req, res, next) => {
  try {
    throwBadRequest("Invalid IP address parameters provided.", [
      "IP parameter 'ipAddress' must be a valid IPv4/IPv6 string.",
      "Parameter 'range' must be between 1 and 32."
    ]);
  } catch (error) {
    next(error);
  }
});

// Global Error Handling Middleware (MUST be registered after all routes)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` Server is running on port: ${PORT}`);
  console.log(` Mode: ${process.env.NODE_ENV}`);
  console.log(` Local: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
