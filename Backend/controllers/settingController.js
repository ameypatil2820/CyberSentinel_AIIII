import Setting from "../models/Setting.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { throwInternal } from "../utils/ApiError.js";

/**
 * @desc    Get system settings
 * @route   GET /api/settings
 * @access  Protected
 */
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = await Setting.create({});
    }
    return sendSuccess(res, settings, "Settings retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update system settings
 * @route   PUT /api/settings
 * @access  Protected (Super Admin)
 */
export const updateSettings = async (req, res, next) => {
  try {
    const { companyName, supportEmail, require2FA, autoBlockIPs } = req.body;
    
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }
    
    if (companyName !== undefined) settings.companyName = companyName;
    if (supportEmail !== undefined) settings.supportEmail = supportEmail;
    if (require2FA !== undefined) settings.require2FA = require2FA;
    if (autoBlockIPs !== undefined) settings.autoBlockIPs = autoBlockIPs;
    
    const updatedSettings = await settings.save();
    return sendSuccess(res, updatedSettings, "Settings updated successfully");
  } catch (error) {
    next(error);
  }
};
