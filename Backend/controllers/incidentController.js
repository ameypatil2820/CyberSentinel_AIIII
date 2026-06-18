import Incident from "../models/Incident.js";
import { throwBadRequest, throwNotFound } from "../utils/ApiError.js";
import { sendSuccess, sendCreated, sendPaginated } from "../utils/apiResponse.js";

/**
 * @desc    Get all incident tickets (with filters & pagination)
 * @route   GET /api/incidents
 * @access  Protected (Super Admin, Security Analyst)
 */
const getIncidents = async (req, res, next) => {
  const { page = 1, limit = 10, status, priority, assignee } = req.query;

  try {
    const query = {};

    // Apply filtration parameters
    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }
    if (assignee) {
      query.assignee = assignee;
    }

    const currentPage = Number(page) || 1;
    const currentLimit = Number(limit) || 10;
    const skipIndex = (currentPage - 1) * currentLimit;

    // Fetch data with user population
    const totalItems = await Incident.countDocuments(query);
    const incidents = await Incident.find(query)
      .populate("assignee", "name email role")
      .sort({ date: -1 })
      .skip(skipIndex)
      .limit(currentLimit);

    return sendPaginated(
      res,
      incidents,
      currentPage,
      currentLimit,
      totalItems,
      "Incident tickets retrieved successfully!"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new incident ticket
 * @route   POST /api/incidents
 * @access  Protected (Super Admin, Security Analyst)
 */
const createIncident = async (req, res, next) => {
  const { title, priority, assignee } = req.body;

  try {
    // 1. Validation
    if (!title || !priority) {
      throwBadRequest("Please provide incident title and priority.");
    }

    // 2. Insert record
    const incident = await Incident.create({
      title,
      priority,
      assignee: assignee || null,
      status: "Open",
    });

    return sendCreated(res, incident, "Incident ticket created successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update incident ticket status or assignee
 * @route   PATCH /api/incidents/:id
 * @access  Protected (Super Admin, Security Analyst)
 */
const updateIncident = async (req, res, next) => {
  const { id } = req.params;
  const { status, assignee, priority } = req.body;

  try {
    // 1. Find ticket
    const incident = await Incident.findById(id);
    if (!incident) {
      throwNotFound("Incident ticket not found.");
    }

    // 2. Apply updates
    if (status) {
      incident.status = status;
    }
    if (assignee !== undefined) {
      incident.assignee = assignee;
    }
    if (priority) {
      incident.priority = priority;
    }

    // 3. Save ticket
    const updatedIncident = await incident.save();
    
    // Populate assignee for the response
    await updatedIncident.populate("assignee", "name email role");

    return sendSuccess(res, updatedIncident, "Incident ticket updated successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Append investigation notes to ticket
 * @route   POST /api/incidents/:id/notes
 * @access  Protected (Super Admin, Security Analyst)
 */
const addIncidentNote = async (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    // 1. Validation
    if (!text) {
      throwBadRequest("Investigation note text is required.");
    }

    // 2. Find ticket
    const incident = await Incident.findById(id);
    if (!incident) {
      throwNotFound("Incident ticket not found.");
    }

    // 3. Push new note. Author name is fetched from active token user profile
    const newNote = {
      author: req.user.name,
      text,
      createdAt: new Date(),
    };

    incident.notes.push(newNote);
    await incident.save();

    return sendSuccess(res, incident, "Investigation note appended successfully!");
  } catch (error) {
    next(error);
  }
};

export default {
  getIncidents,
  createIncident,
  updateIncident,
  addIncidentNote,
};

export {
  getIncidents,
  createIncident,
  updateIncident,
  addIncidentNote,
};
