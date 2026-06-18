import express from "express";
import { exportPDF, exportCSV } from "../controllers/reportController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth protection and restrict to Super Admin and Security Analyst
router.use(protect);
router.use(authorizeRoles("Super Admin", "Security Analyst"));

router.get("/export-pdf", exportPDF);
router.get("/export-csv", exportCSV);

export default router;
