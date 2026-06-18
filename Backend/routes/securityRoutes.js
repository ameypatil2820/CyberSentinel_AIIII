import express from "express";
import { 
  runPhishingScan, 
  runVulnScan, 
  aiChat, 
  getChatHistory, 
  malwareAnalyze,
  malwareUpload,
  getVulnerabilities,
  patchVulnerability,
  deleteVulnerability
} from "../controllers/securityController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { memoryUpload } from "../middlewares/memoryUpload.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Phishing scan is allowed for all logged-in roles
router.post("/phishing-scan", runPhishingScan);

// Vulnerability scan and list/patch are restricted to Super Admin and Security Analyst
router.post(
  "/vuln-scan",
  authorizeRoles("Super Admin", "Security Analyst"),
  runVulnScan
);
router.get(
  "/vulnerabilities",
  authorizeRoles("Super Admin", "Security Analyst"),
  getVulnerabilities
);
router.patch(
  "/vulnerabilities/:id",
  authorizeRoles("Super Admin", "Security Analyst"),
  patchVulnerability
);
router.delete(
  "/vulnerabilities/:id",
  authorizeRoles("Super Admin", "Security Analyst"),
  deleteVulnerability
);

// AI Chat Copilot and history endpoints (Allowed for all logged-in roles)
router.post("/ai-chat", aiChat);
router.get("/ai-chat/history", getChatHistory);

// Malware sandbox analysis (Allowed for all logged-in roles)
router.post("/malware-analyze", malwareAnalyze);
router.post("/malware-upload", memoryUpload("malware"), malwareUpload);

export default router;
