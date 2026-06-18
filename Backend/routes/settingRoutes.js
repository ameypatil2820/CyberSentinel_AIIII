import express from "express";
import { getSettings, updateSettings } from "../controllers/settingController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getSettings)
  .put(protect, authorizeRoles("Super Admin", "Security Analyst", "Employee"), updateSettings);

export default router;
