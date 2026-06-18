import express from "express";
import {
  getIncidents,
  createIncident,
  updateIncident,
  addIncidentNote,
} from "../controllers/incidentController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth protection and role gates to all incident routes
router.use(protect);
router.use(authorizeRoles("Super Admin", "Security Analyst"));

// General endpoints (list, create)
router.route("/")
  .get(getIncidents)
  .post(createIncident);

// Specific ticket endpoints (patch status/assignee, add notes)
router.route("/:id")
  .patch(updateIncident);

router.route("/:id/notes")
  .post(addIncidentNote);

export default router;
