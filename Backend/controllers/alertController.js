import Alert from "../models/Alert.js";
import { throwNotFound } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/apiResponse.js";

/**
 * @desc    Get all security alerts
 * @route   GET /api/alerts
 * @access  Protected (All logged-in roles)
 */
const getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find({}).sort({ timestamp: -1 });
    return sendSuccess(res, alerts, "Security alerts retrieved successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark a specific alert as read
 * @route   PATCH /api/alerts/:id/read
 * @access  Protected (All logged-in roles)
 */
const markRead = async (req, res, next) => {
  const { id } = req.params;

  try {
    const alert = await Alert.findById(id);

    if (!alert) {
      throwNotFound(`Security alert with ID ${id} not found.`);
    }

    alert.isRead = true;
    await alert.save();

    return sendSuccess(res, alert, "Security alert marked as read successfully!");
  } catch (error) {
    next(error);
  }
};

export default {
  getAlerts,
  markRead,
};

export {
  getAlerts,
  markRead,
};
