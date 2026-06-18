import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { throwBadRequest, throwUnauthorized, throwNotFound } from "../utils/ApiError.js";
import { sendSuccess, sendCreated } from "../utils/apiResponse.js";

/**
 * Generate a JWT token for the user.
 * 
 * @param {string} id - User ID
 * @returns {string} - JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/**
 * @desc    Register a new security user
 * @route   POST /api/auth/register
 * @access  Public (or restricted in production)
 */
const register = async (req, res, next) => {
  const { name, email, password, role, mobile, permissions } = req.body;

  try {
    // 1. Validation
    if (!name || !email || !password) {
      throwBadRequest("Please provide name, email, and password registration details.");
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throwBadRequest("Registration failed. A user profile already exists with this email address.");
    }

    // 3. Create user (password is automatically hashed via schema pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      mobile: mobile || "",
      role: role || "Employee",
      permissions: permissions || [],
    });

    // 4. Generate token and return success
    const token = generateToken(user._id);
    const data = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        status: user.status,
      },
      token,
    };

    return sendCreated(res, data, "User account registered successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Validation
    if (!email || !password) {
      throwBadRequest("Please enter email and password credentials.");
    }

    // 2. Find user in registry
    const user = await User.findOne({ email });
    if (!user) {
      throwUnauthorized("Authentication failed. Invalid email or password credentials.");
    }

    if (user.status !== "Active") {
      throwUnauthorized("Authentication failed. User account is inactive.");
    }

    // 3. Verify password hash matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throwUnauthorized("Authentication failed. Invalid email or password credentials.");
    }

    // 4. Generate token and return success
    const token = generateToken(user._id);
    const data = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        status: user.status,
        permissions: user.permissions,
        profilePicture: user.profilePicture,
      },
      token,
    };

    return sendSuccess(res, data, "Authentication successful!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged-in user profile
 * @route   GET /api/auth/me
 * @access  Protected
 */
const getMe = async (req, res, next) => {
  try {
    // req.user has already been set by the 'protect' middleware
    return sendSuccess(res, req.user, "User profile fetched successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all registered users
 * @route   GET /api/users
 * @access  Protected (Super Admin only)
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    return sendSuccess(res, users, "All registered users retrieved successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle user status (Active/Inactive)
 * @route   PUT /api/users/:id/status
 * @access  Protected (Super Admin only)
 */
const updateUserStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!status || !["Active", "Inactive"].includes(status)) {
      throwBadRequest("Please provide a valid status ('Active' or 'Inactive').");
    }

    const user = await User.findById(id);
    if (!user) {
      throwNotFound(`User with ID ${id} not found.`);
    }

    // Do not allow deactivating the main super admin account
    if (user.email === "admin@patilcybershield.com" && status === "Inactive") {
      throwBadRequest("The primary Super Admin user account cannot be deactivated.");
    }

    user.status = status;
    await user.save();

    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
    };

    return sendSuccess(res, updatedUser, `User status updated to ${status} successfully!`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Protected (Super Admin only)
 */
const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      throwNotFound(`User with ID ${id} not found.`);
    }

    // Do not allow deleting the main super admin account
    if (user.email === "admin@patilcybershield.com") {
      throwBadRequest("The primary Super Admin user account cannot be deleted.");
    }

    await User.findByIdAndDelete(id);

    return sendSuccess(res, null, "User deleted successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Edit a user (name and role)
 * @route   PUT /api/users/:id
 * @access  Protected (Super Admin only)
 */
const editUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, role, mobile, email, password, permissions } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      throwNotFound(`User with ID ${id} not found.`);
    }

    if (user.email === "admin@patilcybershield.com") {
      throwBadRequest("The primary Super Admin user account cannot be edited.");
    }

    if (name) user.name = name;
    if (email) {
      // Check if the new email already exists
      if (email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          throwBadRequest("Email is already in use by another account.");
        }
        user.email = email;
      }
    }
    if (password) user.password = password;
    if (mobile !== undefined) user.mobile = mobile;
    if (role && ["Security Analyst", "Employee"].includes(role)) {
      user.role = role;
    }
    if (permissions !== undefined && Array.isArray(permissions)) {
      user.permissions = permissions;
    }

    await user.save();

    return sendSuccess(res, { id: user._id, name: user.name, role: user.role, email: user.email, mobile: user.mobile, status: user.status }, "User updated successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Protected
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throwNotFound("User not found");
    }

    user.name = req.body.name || user.name;
    
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        throwBadRequest("Email is already in use by another account.");
      }
      user.email = req.body.email;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.body.profilePicture !== undefined) {
      user.profilePicture = req.body.profilePicture;
    }

    await user.save();

    return sendSuccess(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      status: user.status,
      permissions: user.permissions,
      profilePicture: user.profilePicture
    }, "Profile updated successfully!");
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  getMe,
  getUsers,
  updateUserStatus,
  deleteUser,
  editUser,
  updateProfile,
};

export {
  register,
  login,
  getMe,
  getUsers,
  updateUserStatus,
  deleteUser,
  editUser,
  updateProfile,
};
