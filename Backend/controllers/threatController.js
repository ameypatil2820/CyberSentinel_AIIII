import Threat from "../models/Threat.js";
import { throwBadRequest } from "../utils/ApiError.js";
import { sendCreated, sendPaginated } from "../utils/apiResponse.js";

/**
 * @desc    Get all threats (with filters & pagination)
 * @route   GET /api/threats
 * @access  Protected (Super Admin, Security Analyst)
 */
const getThreats = async (req, res, next) => {
  const { page = 1, limit = 10, severity, status, type, search } = req.query;

  try {
    const query = {};

    // Apply filtration parameters
    if (severity) {
      query.severity = severity;
    }
    if (status) {
      query.status = status;
    }
    if (type) {
      query.type = type;
    }

    // Apply search query across source, target, and type
    if (search) {
      query.$or = [
        { source: { $regex: search, $options: "i" } },
        { target: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }

    const currentPage = Number(page) || 1;
    const currentLimit = Number(limit) || 10;
    const skipIndex = (currentPage - 1) * currentLimit;

    // Fetch matching data and count total matches
    const totalItems = await Threat.countDocuments(query);
    const threats = await Threat.find(query)
      .sort({ timestamp: -1 })
      .skip(skipIndex)
      .limit(currentLimit);

    return sendPaginated(
      res,
      threats,
      currentPage,
      currentLimit,
      totalItems,
      "Threat records retrieved successfully!"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create/Ingest a new threat signature
 * @route   POST /api/threats
 * @access  Protected (Super Admin, Security Analyst)
 */
const createThreat = async (req, res, next) => {
  const { type, source, target, severity, status } = req.body;

  try {
    // 1. Validation
    if (!type || !source || !target || !severity) {
      throwBadRequest("Please provide threat type, source, target, and severity details.");
    }

    // 2. Insert record
    const threat = await Threat.create({
      type,
      source,
      target,
      severity,
      status: status || "Active",
    });

    return sendCreated(res, threat, "New threat signature ingested successfully!");
  } catch (error) {
    next(error);
  }
};

export default {
  getThreats,
  createThreat,
};

export {
  getThreats,
  createThreat,
};
