import express from "express";
import { getThreats, createThreat } from "../controllers/threatController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth protect and role gates to all threat routes
router.use(protect);
router.use(authorizeRoles("Super Admin", "Security Analyst"));

// Threat endpoints
router.route("/")
  .get(getThreats)
  .post(createThreat);

export default router;
