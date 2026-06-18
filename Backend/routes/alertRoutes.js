import express from "express";
import { getAlerts, markRead } from "../controllers/alertController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Endpoint to fetch all alerts and to mark an alert as read
router.route("/").get(getAlerts);
router.route("/:id/read").patch(markRead);

export default router;
